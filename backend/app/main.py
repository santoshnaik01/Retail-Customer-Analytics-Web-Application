from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import APP_TITLE, APP_VERSION, APP_DESCRIPTION, CORS_ORIGINS
from app.utils.responses import success_response, error_response
from app.api.routes_upload import router as upload_router

app = FastAPI(title=APP_TITLE, version=APP_VERSION, description=APP_DESCRIPTION)
app.include_router(upload_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response("HTTP_ERROR", str(exc.detail)),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content=error_response("INVALID_REQUEST", "The request data is invalid."),
    )


@app.get("/")
def root():
    return success_response({"service": "retail-analytics-api"}, "API is running")


@app.get("/api/health")
def health_check():
    return success_response({"service": "retail-analytics-api", "state": "healthy"})