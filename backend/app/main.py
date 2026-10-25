from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import APP_TITLE, APP_VERSION, APP_DESCRIPTION, CORS_ORIGINS
from app.services.dataset_manager import DatasetManager
from app.api.routes_upload import router as upload_router
from app.api.routes_dashboard import router as dashboard_router
from app.api.routes_analytics import router as analytics_router
from app.api.routes_explorer import router as explorer_router
from app.api.routes_reports import router as reports_router

app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(upload_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(explorer_router)
app.include_router(reports_router)


@app.get("/")
def root():
    manager = DatasetManager.get_instance()
    has_dataset = manager.original_df is not None
    return {
        "name": APP_TITLE,
        "version": APP_VERSION,
        "status": "running",
        "docs_url": "/docs",
        "dataset_loaded": has_dataset,
        "dataset_name": manager.filename if has_dataset else None,
        "records_count": len(manager.original_df) if has_dataset else 0,
    }


@app.get("/api/health")
def health_check():
    manager = DatasetManager.get_instance()
    has_data = manager.original_df is not None
    return {
        "status": "healthy",
        "dataset_loaded": has_data,
        "filename": manager.filename if has_data else None,
        "row_count": len(manager.original_df) if has_data else 0,
        "is_cleaned": manager.is_cleaned,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
