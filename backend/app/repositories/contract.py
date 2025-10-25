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
    async def list_contracts(
        status: Optional[ContractStatus] = None, 
        skip: int = 0, 
        limit: int = 20,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = "desc"
    ) -> List[ContractDocument]:
        query = {}
        if status:
            query["status"] = status
        
        # Build the query
        find_query = ContractDocument.find(query)
        
        # Apply sorting if sort_by is provided
        if sort_by:
            # Map frontend sort field names to database field names
            sort_field = sort_by if sort_by in ["created_at", "last_updated", "file_name", "status"] else "created_at"
            sort_direction = -1 if sort_order == "desc" else 1
            find_query = find_query.sort((sort_field, sort_direction))
        else:
            # Default sort by created_at descending
            find_query = find_query.sort(("created_at", -1))
        
        return await find_query.skip(skip).limit(limit).to_list()

    @staticmethod
    async def update_contract_status(contract_id: PydanticObjectId, new_status: ContractStatus) -> Optional[ContractDocument]:
        contract = await ContractDocument.get(contract_id)
        if not contract:
            return None
        contract.status = new_status
        contract.version += 1  # Auto-increment version on every update
        contract.last_updated = datetime.utcnow()
        await contract.save()
        return contract

    @staticmethod
    async def update_contract(
        contract_id: PydanticObjectId,
        content: Optional[str] = None,
        name: Optional[str] = None,
        category: Optional[str] = None
    ) -> Optional[ContractDocument]:
        contract = await ContractDocument.get(contract_id)
        if not contract:
            return None
        
        # Update fields if provided
        if content is not None:
            contract.content = content
        if name is not None:
            contract.file_name = name
        if category is not None:
            contract.category = category
        
        contract.version += 1
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
