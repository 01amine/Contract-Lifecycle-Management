from typing import List, Optional
from datetime import datetime
from beanie import PydanticObjectId
from app.models.documentUploaded import ContractDocument, ContractStatus


class ContractRepository:

    @staticmethod
    async def create_contract(file_name: str, file_id: str, content: Optional[str] = None) -> ContractDocument:
        contract = ContractDocument(
            file_name=file_name,
            file_id=file_id,
            content=content,
            status=ContractStatus.DRAFT
        )
        await contract.insert()
        return contract

    @staticmethod
    async def get_contract_by_id(contract_id: PydanticObjectId) -> Optional[ContractDocument]:
        return await ContractDocument.get(contract_id)

    @staticmethod
    async def list_contracts(status: Optional[ContractStatus] = None, skip: int = 0, limit: int = 20) -> List[ContractDocument]:
        query = {}
        if status:
            query["status"] = status
        return await ContractDocument.find(query).skip(skip).limit(limit).to_list()

    @staticmethod
    async def update_contract_status(contract_id: PydanticObjectId, new_status: ContractStatus) -> Optional[ContractDocument]:
        contract = await ContractDocument.get(contract_id)
        if not contract:
            return None
        contract.status = new_status
        contract.last_updated = datetime.utcnow()
        await contract.save()
        return contract

    @staticmethod
    async def update_contract_content(contract_id: PydanticObjectId, new_content: str) -> Optional[ContractDocument]:
        contract = await ContractDocument.get(contract_id)
        if not contract:
            return None
        contract.content = new_content
        contract.last_updated = datetime.utcnow()
        await contract.save()
        return contract

    @staticmethod
    async def delete_contract(contract_id: PydanticObjectId) -> bool:
        contract = await ContractDocument.get(contract_id)
        if not contract:
            return False
        await contract.delete()
        return True
