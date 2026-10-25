from fastapi import APIRouter, HTTPException
from app.services.dataset_manager import DatasetManager
from app.services.analytics_service import AnalyticsService
from app.schemas.models import FilterParams, DashboardDataResponse

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.post("", response_model=DashboardDataResponse)
def get_dashboard_data(filters: FilterParams):
    try:
        manager = DatasetManager.get_instance()
        df = manager.get_df(use_cleaned=filters.use_cleaned)
        filtered_df = manager.apply_filters(df, filters)
        return AnalyticsService.calculate_dashboard(filtered_df, filters.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
