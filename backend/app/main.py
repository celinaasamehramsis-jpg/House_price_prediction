import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.api.routes.prediction import router as prediction_router
from backend.app.schemas.prediction import (
    HealthCheckResponse,
    HousePredictionInput,
    HousePredictionOutput,
)
from backend.app.services.prediction_service import model_service

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("house_price_api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler to load model and resources on application startup."""
    logger.info("Initializing FastAPI Application Lifespan...")
    try:
        model_service.load_model_and_locations()
        logger.info("Application resources initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to load model on startup: {e}")
    yield
    logger.info("Application shutdown: Cleaning up resources...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production Ready FastAPI Backend for House Price Prediction ML Model",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root level health endpoint
@app.get(
    "/health",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    tags=["Health"]
)
def health_check() -> HealthCheckResponse:
    return HealthCheckResponse(
        status="healthy" if model_service.is_model_loaded() else "degraded",
        model_loaded=model_service.is_model_loaded(),
        version=settings.VERSION
    )

# Root level alias for /predict to support direct calls
@app.post(
    "/predict",
    response_model=HousePredictionOutput,
    status_code=status.HTTP_200_OK,
    tags=["Prediction"]
)
async def predict_price(input_data: HousePredictionInput) -> HousePredictionOutput:
    return model_service.predict(input_data)

# Include API v1 routers
app.include_router(
    prediction_router,
    prefix=settings.API_V1_STR,
    tags=["Prediction Router"]
)

@app.get("/", tags=["Root"])
def root_info():
    return {
        "message": "Welcome to the House Price Prediction API",
        "docs": "/docs",
        "health": "/health",
        "predict_endpoint": "/predict"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
