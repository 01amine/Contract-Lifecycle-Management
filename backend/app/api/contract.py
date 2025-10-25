from datetime import datetime
import uuid
from fastapi import APIRouter
from fastapi.responses import HTMLResponse

from minio import DocumentBucket
from app.models.documentUploaded import ContractDocument


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
