from typing import Dict, List

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from app.services import dataset_store
from app.services.analytics_service import build_dashboard, get_filter_options
from app.services.cleaning_service import clean_dataset
from app.utils.responses import error_response, success_response

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


class DashboardRequest(BaseModel):
    filters: Dict[str, List[str]] = Field(default_factory=dict)


def _error(status_code, code, message):
    return JSONResponse(status_code=status_code, content=error_response(code, message))


def _working_dataset():
    """Use the cleaned dataset; clean the original automatically if needed."""
    cleaned = dataset_store.get_cleaned()
    if cleaned is not None:
        return cleaned
    original = dataset_store.get_original()
    if original is None:
        return None
    cleaned, _ = clean_dataset(original)
    dataset_store.save_cleaned(cleaned)
    return cleaned


@router.get("/filters")
def dashboard_filters():
    try:
        df = _working_dataset()
    except ValueError as exc:
        return _error(400, "CLEANING_FAILED", str(exc))
    if df is None:
        return _error(404, "NO_DATASET", "No dataset is loaded. Please upload a CSV file first.")
    return success_response(get_filter_options(df), "Available dashboard filters")


@router.post("")
def dashboard(request: DashboardRequest = DashboardRequest()):
    try:
        df = _working_dataset()
    except ValueError as exc:
        return _error(400, "CLEANING_FAILED", str(exc))
    if df is None:
        return _error(404, "NO_DATASET", "No dataset is loaded. Please upload a CSV file first.")
    try:
        data = build_dashboard(df, request.filters)
    except ValueError as exc:
        return _error(400, "INVALID_FILTER", str(exc))
    message = (
        "No records match the selected filters"
        if data["record_count"] == 0
        else "Dashboard data"
    )
    return success_response(data, message)