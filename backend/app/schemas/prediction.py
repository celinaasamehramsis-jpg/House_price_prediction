from pydantic import BaseModel, Field
from typing import Optional, List

class HousePredictionInput(BaseModel):
    carpet_area_sqft: float = Field(
        ..., 
        gt=0, 
        description="Carpet area in square feet",
        json_schema_extra={"example": 1250.0}
    )
    floor_num: int = Field(
        ..., 
        ge=0, 
        le=150, 
        description="Floor number of the property",
        json_schema_extra={"example": 5}
    )
    bathroom: int = Field(
        ..., 
        ge=1, 
        le=20, 
        description="Number of bathrooms",
        json_schema_extra={"example": 2}
    )
    balcony: int = Field(
        ..., 
        ge=0, 
        le=10, 
        description="Number of balconies",
        json_schema_extra={"example": 1}
    )
    location_grouped: str = Field(
        ..., 
        description="Target location city / neighborhood",
        json_schema_extra={"example": "mumbai"}
    )
    Furnishing: str = Field(
        ..., 
        description="Furnishing status (Furnished, Semi-Furnished, Unfurnished)",
        json_schema_extra={"example": "Semi-Furnished"}
    )
    Transaction: str = Field(
        ..., 
        description="Transaction type (Resale, New Property)",
        json_schema_extra={"example": "Resale"}
    )
    Ownership: str = Field(
        ..., 
        description="Ownership type (Freehold, Co-operative Society, Leasehold, Power Of Attorney)",
        json_schema_extra={"example": "Freehold"}
    )
    facing: str = Field(
        ..., 
        description="Property facing direction (East, West, North - East, etc.)",
        json_schema_extra={"example": "East"}
    )

class HousePredictionOutput(BaseModel):
    predicted_price: float = Field(..., description="Raw predicted price in INR")
    formatted_price: str = Field(..., description="Human-readable formatted currency (e.g. ₹ 75.50 Lakhs)")
    currency: str = Field(default="INR", description="Currency code")
    features_summary: dict = Field(..., description="Echo of provided input features")

class LocationListResponse(BaseModel):
    locations: List[str]
    total: int

class HealthCheckResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str
