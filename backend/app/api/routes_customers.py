from fastapi import APIRouter

from app.api.routes_dashboard import DashboardRequest, _error, _working_dataset
from app.services.customer_analytics_service import build_customer_analytics
from app.utils.responses import success_response

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.post("/customers")
def customer_analytics(request: DashboardRequest = DashboardRequest()):
    try:
        df = _working_dataset()
    except ValueError as exc:
        return _error(400, "CLEANING_FAILED", str(exc))
    if df is None:
        return _error(404, "NO_DATASET", "No dataset is loaded. Please upload a CSV file first.")
    try:
        data = build_customer_analytics(df, request.filters)
    except ValueError as exc:
        return _error(400, "INVALID_FILTER", str(exc))
    message = (
        "No records match the selected filters"
        if data["record_count"] == 0
        else "Customer analytics"
    )
    return success_response(data, message)