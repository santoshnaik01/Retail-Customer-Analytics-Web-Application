from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.dataset_manager import DatasetManager
from app.schemas.models import (
    DatasetSummaryResponse,
    DataQualityResponse,
    CleanDatasetRequest,
    CleaningResultResponse,
)

router = APIRouter(prefix="/api", tags=["Upload & Data Cleaning"])


@router.post("/upload", response_model=DatasetSummaryResponse)
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a valid CSV file (.csv).",
        )

    try:
        content = await file.read()
        manager = DatasetManager.get_instance()
        manager.load_from_bytes(content, file.filename)
        return manager.get_summary()
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred while processing the CSV: {str(e)}",
        )


@router.get("/dataset/summary", response_model=DatasetSummaryResponse)
def get_dataset_summary():
    try:
        manager = DatasetManager.get_instance()
        return manager.get_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dataset/quality", response_model=DataQualityResponse)
def get_dataset_quality():
    try:
        manager = DatasetManager.get_instance()
        return manager.get_quality_report()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/dataset/clean", response_model=CleaningResultResponse)
def clean_dataset(request: CleanDatasetRequest):
    try:
        manager = DatasetManager.get_instance()
        summary = manager.run_cleaning(
            impute_missing_rating=request.impute_missing_rating,
            imputation_strategy=request.imputation_strategy,
            trim_whitespace=request.trim_whitespace,
            remove_duplicates=request.remove_duplicates,
        )
        return CleaningResultResponse(
            success=True,
            message="Dataset cleaning completed successfully.",
            records_before=summary["records_before"],
            records_after=summary["records_after"],
            missing_before=summary["missing_before"],
            missing_after=summary["missing_after"],
            duplicates_removed=summary["duplicates_removed"],
            whitespace_trimmed_cols=summary["whitespace_trimmed_cols"],
            operations_log=summary["operations_log"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/dataset/reset", response_model=DatasetSummaryResponse)
def reset_dataset():
    try:
        manager = DatasetManager.get_instance()
        manager._initialize_default()
        return manager.get_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset dataset: {str(e)}")
