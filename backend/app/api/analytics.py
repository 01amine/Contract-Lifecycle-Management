from fastapi import APIRouter
from app.services.analytics import AnalyticsService
from app.dto.analytics import AnalyticsResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/", response_model=AnalyticsResponse)
async def get_analytics():
    return await AnalyticsService.get_analytics()
