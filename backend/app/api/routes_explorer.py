from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np

from app.services.dataset_manager import DatasetManager
from app.schemas.models import DataExplorerResponse

router = APIRouter(prefix="/api/dataset", tags=["Data Explorer"])


class ExplorerRequest(BaseModel):
    page: int = 1
    page_size: int = 10
    search_query: Optional[str] = None
    sort_column: Optional[str] = None
    sort_direction: str = "asc"  # "asc" or "desc"
    use_cleaned: bool = True
    category_filter: Optional[str] = None
    gender_filter: Optional[str] = None
    location_filter: Optional[str] = None
    season_filter: Optional[str] = None


@router.post("/data", response_model=DataExplorerResponse)
def get_explorer_data(request: ExplorerRequest):
    try:
        manager = DatasetManager.get_instance()
        df = manager.get_df(use_cleaned=request.use_cleaned)
        filtered = df.copy()

        # Specific filters
        if request.category_filter and request.category_filter != "All" and "Category" in filtered.columns:
            filtered = filtered[filtered["Category"].str.lower() == request.category_filter.lower()]
        if request.gender_filter and request.gender_filter != "All" and "Gender" in filtered.columns:
            filtered = filtered[filtered["Gender"].str.lower() == request.gender_filter.lower()]
        if request.location_filter and request.location_filter != "All" and "Location" in filtered.columns:
            filtered = filtered[filtered["Location"].str.lower() == request.location_filter.lower()]
        if request.season_filter and request.season_filter != "All" and "Season" in filtered.columns:
            filtered = filtered[filtered["Season"].str.lower() == request.season_filter.lower()]

        # Global search
        if request.search_query and request.search_query.strip():
            q = request.search_query.strip().lower()
            # Search across all columns by string representation
            mask = filtered.astype(str).apply(lambda row: row.str.lower().str.contains(q, regex=False).any(), axis=1)
            filtered = filtered[mask]

        # Sorting
        if request.sort_column and request.sort_column in filtered.columns:
            ascending = request.sort_direction.lower() != "desc"
            filtered = filtered.sort_values(by=request.sort_column, ascending=ascending)

        total_rows = len(filtered)
        page = max(1, request.page)
        page_size = max(1, min(request.page_size, 500))
        total_pages = max(1, int(np.ceil(total_rows / page_size)))

        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paged_df = filtered.iloc[start_idx:end_idx]

        # Convert NaN to None for JSON
        paged_df = paged_df.replace({np.nan: None})
        rows = paged_df.to_dict(orient="records")

        return DataExplorerResponse(
            total_rows=total_rows,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            columns=filtered.columns.tolist(),
            rows=rows,
            dataset_type="cleaned" if request.use_cleaned else "original",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
