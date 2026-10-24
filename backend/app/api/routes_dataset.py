import json
from typing import Literal, Optional

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.services import dataset_store
from app.services.cleaning_service import clean_dataset
from app.services.validation_service import DatasetValidationService
from app.utils.responses import error_response, success_response

router = APIRouter(prefix="/api/dataset", tags=["Dataset"])


class CleanRequest(BaseModel):
    impute_missing_rating: Optional[Literal["median", "mean"]] = None


def _error(status_code, code, message):
    return JSONResponse(status_code=status_code, content=error_response(code, message))


def _no_dataset():
    return _error(404, "NO_DATASET", "No dataset is loaded. Please upload a CSV file first.")


@router.get("/summary")
def dataset_summary():
    original = dataset_store.get_original()
    if original is None:
        return _no_dataset()
    cleaned = dataset_store.get_cleaned()
    data = {
        "filename": dataset_store.get_filename(),
        "status": "cleaned" if cleaned is not None else "uploaded",
        "original": {"rows": int(original.shape[0]), "columns": int(original.shape[1])},
        "cleaned": (
            {"rows": int(cleaned.shape[0]), "columns": int(cleaned.shape[1])}
            if cleaned is not None
            else None
        ),
        "column_names": list(original.columns),
        "data_types": {col: str(t) for col, t in original.dtypes.items()},
    }
    return success_response(data, "Dataset summary")


@router.get("/quality")
def dataset_quality():
    original = dataset_store.get_original()
    if original is None:
        return _no_dataset()
    return success_response(DatasetValidationService.validate(original), "Data quality report")


@router.post("/clean")
def clean_current_dataset(request: Optional[CleanRequest] = None):
    original = dataset_store.get_original()
    if original is None:
        return _no_dataset()
    option = request.impute_missing_rating if request else None
    try:
        cleaned, summary = clean_dataset(original, impute_missing_rating=option)
    except ValueError as exc:
        return _error(400, "CLEANING_FAILED", str(exc))
    dataset_store.save_cleaned(cleaned)
    return success_response(summary, "Dataset cleaned successfully")


@router.get("/preview")
def dataset_preview(
    version: Literal["original", "cleaned"] = "original",
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    if dataset_store.get_original() is None:
        return _no_dataset()
    df = dataset_store.get_cleaned() if version == "cleaned" else dataset_store.get_original()
    if df is None:
        return _error(404, "NOT_CLEANED", "The dataset has not been cleaned yet.")

    start = (page - 1) * page_size
    rows = json.loads(df.iloc[start:start + page_size].to_json(orient="records"))
    total_rows = int(len(df))
    data = {
        "version": version,
        "page": page,
        "page_size": page_size,
        "total_rows": total_rows,
        "total_pages": (total_rows + page_size - 1) // page_size,
        "columns": list(df.columns),
        "rows": rows,
    }
    return success_response(data, "Dataset preview")