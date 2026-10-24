import io

import pandas as pd
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse

from app.services import dataset_store
from app.utils.responses import error_response, success_response

router = APIRouter(prefix="/api", tags=["Upload"])

MAX_FILE_SIZE_MB = 10


def _error(status_code, code, message):
    return JSONResponse(status_code=status_code, content=error_response(code, message))


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not filename.lower().endswith(".csv"):
        return _error(400, "UNSUPPORTED_FORMAT", "Please upload a file with the .csv extension.")

    content = await file.read()
    if len(content) == 0:
        return _error(400, "EMPTY_FILE", "The uploaded file is empty.")
    if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
        return _error(413, "FILE_TOO_LARGE", f"The file is larger than {MAX_FILE_SIZE_MB} MB.")

    try:
        df = pd.read_csv(io.BytesIO(content))
    except (UnicodeDecodeError, pd.errors.ParserError, pd.errors.EmptyDataError):
        return _error(400, "UNREADABLE_FILE", "The file could not be read as a valid CSV.")

    if df.shape[1] == 0 or df.empty:
        return _error(400, "NO_DATA", "The CSV file has no data rows.")

    dataset_store.save_original(df, filename)

    data = {
        "upload_status": "uploaded",
        "filename": filename,
        "row_count": int(df.shape[0]),
        "column_count": int(df.shape[1]),
        "column_names": list(df.columns),
        "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
    }
    return success_response(data, "File uploaded successfully")