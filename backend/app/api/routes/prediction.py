from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.prediction import (
    HousePredictionInput,
    HousePredictionOutput,
    LocationListResponse,
)
from backend.app.services.prediction_service import model_service

router = APIRouter()

@router.post(
    "/predict",
    response_model=HousePredictionOutput,
    status_code=status.HTTP_200_OK,
    summary="Predict House Price",
    description="Estimates the property price in INR based on carpet area, location, floor, bathrooms, balconies, furnishing, transaction, ownership, and facing."
)
async def predict_house_price(input_data: HousePredictionInput) -> HousePredictionOutput:
    try:
        return model_service.predict(input_data)
    except RuntimeError as re:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(re)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )

@router.get(
    "/locations",
    response_model=LocationListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Available Locations",
    description="Returns the list of locations supported by the prediction model."
)
async def get_supported_locations() -> LocationListResponse:
    locations = model_service.get_locations()
    return LocationListResponse(
        locations=locations,
        total=len(locations)
    )
