from typing import List, Optional
from beanie import PydanticObjectId
from datetime import datetime
from app.models.policy import Template,  PoStatus  ,Clause
from app.dto.policy import TemplateCreateSchema, TemplateUpdateSchema


class TemplateRepository:

    @staticmethod
    async def create(template: Template) -> Template:
        return await template.insert()

    @staticmethod
    async def get_by_id(template_id: str) -> Optional[Template]:
        return await Template.get(template_id)

    @staticmethod
    async def get_by_country_and_type(country: str, policy_type: str) -> Optional[Template]:
        return await Template.find_one(
            (Template.country == country) & (Template.policy_type == policy_type) & (Template.status == PoStatus.ACTIVE)
        )

    @staticmethod
    async def list_templates(country: Optional[str] = None, policy_type: Optional[str] = None) -> List[Template]:
        query = Template.find({})
        if country:
            query = query.find(Template.country == country)
        if policy_type:
            query = query.find(Template.policy_type == policy_type)
        return await query.to_list()

    @staticmethod
    async def update(template_id: str, update_data: TemplateUpdateSchema) -> Optional[Template]:
        update_dict = update_data.dict(exclude_unset=True)
        update_dict['updated_at'] = datetime.utcnow()
        template = await Template.get(template_id)
        if template:
            await template.update({"$set": update_dict})
            if 'version' not in update_dict:
                template.version += 1
                await template.save()
            return template
        return None

    @staticmethod
    async def soft_delete(template_id: str) -> bool:
        template = await Template.get(template_id)
        if template:
            template.status = PoStatus.DELETED
            template.updated_at = datetime.utcnow()
            await template.save()
            return True
        return False
