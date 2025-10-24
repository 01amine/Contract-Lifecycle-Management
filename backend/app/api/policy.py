from fastapi import APIRouter, HTTPException
from typing import List
from app.models.policy import Template
from app.dto.policy import TemplateCreateSchema, TemplateUpdateSchema,  TemplateReadSchema
from app.repositories.policy import TemplateRepository

router = APIRouter(prefix="/templates", tags=["Templates"])

# Create Template
@router.post("/", response_model=TemplateReadSchema)
async def create_template(template_create: TemplateCreateSchema):
    template = Template(**template_create.dict())
    created = await TemplateRepository.create(template)
    return TemplateReadSchema(**created.dict())

# Get Template by ID
@router.get("/{template_id}", response_model=TemplateReadSchema)
async def get_template(template_id: str):
    template = await TemplateRepository.get_by_id(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return TemplateReadSchema(**template.dict())

# List Templates
@router.get("/", response_model=List[TemplateReadSchema])
async def list_templates(country: str = None, policy_type: str = None):
    templates = await TemplateRepository.list_templates(country, policy_type)
    return [TemplateReadSchema(**t.dict()) for t in templates]

# Update Template
@router.patch("/{template_id}", response_model=TemplateReadSchema)
async def update_template(template_id: str, update_data: TemplateUpdateSchema):
    updated = await TemplateRepository.update(template_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Template not found")
    return TemplateReadSchema(**updated.dict())

# Soft Delete Template
@router.delete("/{template_id}")
async def delete_template(template_id: str):
    deleted = await TemplateRepository.soft_delete(template_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"detail": "Template deleted successfully"}
