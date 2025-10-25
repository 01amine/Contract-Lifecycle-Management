
import tempfile
from typing import Generator, Optional
import uuid
from pathlib import Path 
from beanie import PydanticObjectId
from fastapi import APIRouter, Body, File, HTTPException, Query, Request, UploadFile
from fastapi.responses import HTMLResponse, StreamingResponse
from app.minio import DocumentBucket
from app.models.documentUploaded import ContractDocument, ContractStatus
from app.services.extractor import DocumentExtractor, document_extraction_worker
from app.repositories.contract import ContractRepository
from app.services.agent import agent
from app.services.segmenter import  extract_clauses
from app.services.consistency_checker import check_compliance, convert_clauses_for_compliance


router = APIRouter(prefix="/contract", tags=["Contract"])
@router.get("/upload-page", response_class=HTMLResponse)
async def get_signed_url():
    file_id = str(uuid.uuid4())
    file_name = f"contract_{file_id}.pdf"

    doc_bucket = DocumentBucket(file_prefix="contracts")
    signed_url = await doc_bucket.get_presigned_put_url(
        object_name=file_name,
        expires_in_seconds=20
    )

    contract_doc = ContractDocument(
        file_name=file_name,
        file_id=file_id,
    )
    await contract_doc.insert()

    html = f"""
    <html>
        <head>
            <title>Upload Contract</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f8f9fa;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }}
                .container {{
                    background: white;
                    padding: 2rem 3rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    width: 400px;
                }}
                h3 {{
                    margin-bottom: 1rem;
                    color: #333;
                }}
                form {{
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }}
                input[type="file"] {{
                    border: 1px solid #ccc;
                    padding: 0.5rem;
                    border-radius: 6px;
                }}
                input[type="submit"] {{
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 0.75rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                }}
                input[type="submit"]:hover {{
                    background-color: #0056b3;
                }}
                p {{
                    color: #666;
                    font-size: 0.9rem;
                    margin-top: 1rem;
                }}
                .info {{
                    background-color: #e9ecef;
                    padding: 0.5rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h3>Upload Your Contract</h3>
                <form action="{signed_url}" method="put" enctype="multipart/form-data">
                    <input type="file" name="file" accept=".pdf,.docx,.txt" required />
                    <input type="submit" value="Upload" />
                </form>
                <div class="info">
                    <p>Contract ID: {contract_doc.id}</p>
                    <p>File ID: {file_id}</p>
                    <p><strong>⚠️ URL expires in 20 seconds.</strong></p>
                </div>
            </div>
        </body>
    </html>
    """
    return HTMLResponse(content=html)

@router.post("/upload-contract", description="Upload contract image, PDF, text, or handwriting",response_model=ContractDocument)
async def upload_contract(
    request: Request,
    file: Optional[UploadFile] = File(None),
    content: Optional[str] = Body(None),
):
    if not file and not content:
        return {"error": "Either a file or content must be provided."}

    document_extract: DocumentExtractor = request.app.state.document_extract
    doc_bucket = DocumentBucket(file_prefix="contracts")

    
    if file:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as tmp_file:
            tmp_file.write(await file.read())
            tmp_file_path = tmp_file.name
        path_obj = Path(tmp_file_path)
        file_id= await doc_bucket.put(file=file, object_name=file.filename)
        extracted_data: str = document_extract.extract(path_obj)
        path_obj.unlink()
    contract_doc = ContractDocument(
        file_name=file.filename if file.filename else f"contract_{file_id}.pdf",
        file_id=file_id,
        content=content if content else extracted_data,
    )
    await contract_doc.insert()

    return contract_doc.model_dump()


@router.post("/{contract_id}/extract-clauses")
async def extract_clauses_endpoint(contract_id: PydanticObjectId):    
    contract = await ContractRepository.get_contract_by_id(contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    raw_text = contract.content
    print(raw_text)
    extraction_performed = False
    if not raw_text:
        if not contract.file_name:
            raise HTTPException(status_code=400, detail="No file name")

    try:
        result = extract_clauses(raw_text)
        clauses_data = [clause.model_dump() for clause in result.clauses]
        await contract.update({
            "$set": {
                "clauses": clauses_data,
                "status": ContractStatus.UNDER_REVIEW
            }
        })

        return clauses_data

    except Exception as e:
        await contract.update({"$set": {"status": ContractStatus.REJECTED}})
        raise HTTPException(status_code=500, detail=f"Clause extraction failed: {e}")
    


@router.post("/{contract_id}/compliance-check")
async def compliance_check_endpoint(contract_id: PydanticObjectId):
   
    
    contract = await ContractRepository.get_contract_by_id(contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    if not contract or len(contract.clauses) == 0:
        raise HTTPException(
            status_code=400,
            detail="No clauses found. Run extraction first."
        )
    
    try:
        clauses = convert_clauses_for_compliance(contract.clauses)
        
        result = check_compliance(
            clauses=clauses,
            contract_id=str(contract_id),
            collection_name="company_policies"
        )
        
        risks = [risk.model_dump() for risk in result.risks]
        compliance_score = result.compliance_score
        
        if compliance_score >= 0.9:
            new_status = ContractStatus.APPROVED
        elif compliance_score >= 0.7:
            new_status = ContractStatus.UNDER_REVIEW
        else:
            new_status = ContractStatus.UNDER_REVIEW
        
        await contract.update({
            "$set": {
                "risks": risks,
                "compliance_score": compliance_score,
                "status": new_status,
            }
        })
        
        return {
            "risks": risks,
            "compliance_score": compliance_score
        }
        
    except Exception as e:
        await contract.update({
            "$set": {"status": ContractStatus.REJECTED}
        })
        raise HTTPException(
            status_code=500,
            detail=f"Compliance check failed: {str(e)}"
        )

@router.get("/{contract_id}", response_model=ContractDocument)
async def get_contract(contract_id: PydanticObjectId):
    """
    Retrieve a contract by its ID.
    """
    contract = await ContractRepository.get_contract_by_id(contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract



@router.get("/", response_model=list[ContractDocument])
async def list_contracts(
    status: Optional[ContractStatus] = Query(None),
    skip: int = Query(0),
    limit: int = Query(20)
):
    contracts = await ContractRepository.list_contracts(status, skip, limit)
    return contracts

@router.put("/{contract_id}/status", response_model=ContractDocument)
async def update_contract_status(
    contract_id: PydanticObjectId,
    new_status: ContractStatus = Body(...)
):
    updated = await ContractRepository.update_contract_status(contract_id, new_status)
    if not updated:
        raise HTTPException(status_code=404, detail="Contract not found")
    return updated

@router.put("/{contract_id}/content", response_model=ContractDocument)
async def update_contract_content(
    contract_id: PydanticObjectId,
    new_content: str = Body(...)
):
    updated = await ContractRepository.update_contract_content(contract_id, new_content)
    if not updated:
        raise HTTPException(status_code=404, detail="Contract not found")
    return updated


@router.delete("/{contract_id}", response_model=dict)
async def delete_contract(contract_id: PydanticObjectId):
    deleted = await ContractRepository.delete_contract(contract_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Contract not found")
    return {"message": "Contract deleted successfully"}