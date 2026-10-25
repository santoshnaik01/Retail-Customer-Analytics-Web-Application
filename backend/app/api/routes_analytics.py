from fastapi import APIRouter, HTTPException
from app.services.dataset_manager import DatasetManager
from app.services.analytics_service import AnalyticsService
from app.schemas.models import (
    FilterParams,
    CustomerAnalyticsResponse,
    ShoppingPatternsResponse,
)

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.post("/customers", response_model=CustomerAnalyticsResponse)
def get_customer_analytics(filters: FilterParams):
    try:
        manager = DatasetManager.get_instance()
        df = manager.get_df(use_cleaned=filters.use_cleaned)
        filtered_df = manager.apply_filters(df, filters)
        return AnalyticsService.calculate_customers(filtered_df)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/shopping-patterns", response_model=ShoppingPatternsResponse)
def get_shopping_patterns(filters: FilterParams):
    try:
        manager = DatasetManager.get_instance()
        df = manager.get_df(use_cleaned=filters.use_cleaned)
        filtered_df = manager.apply_filters(df, filters)
        return AnalyticsService.calculate_shopping_patterns(filtered_df)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
