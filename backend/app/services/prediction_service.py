import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

# Scikit-Learn Version Compatibility Patch for Unpickling Pipeline Models
try:
    import sklearn.compose._column_transformer
    from sklearn.impute import SimpleImputer
    
    if not hasattr(sklearn.compose._column_transformer, '_RemainderColsList'):
        class _RemainderColsList(list):
            pass
        sklearn.compose._column_transformer._RemainderColsList = _RemainderColsList

    if not hasattr(SimpleImputer, '_fill_dtype'):
        SimpleImputer._fill_dtype = property(lambda self: getattr(self, '_fit_dtype', object))
except Exception:
    pass

import joblib
import pandas as pd

from backend.app.core.config import settings
from backend.app.schemas.prediction import HousePredictionInput, HousePredictionOutput

logger = logging.getLogger("house_price_api")

# Exact training feature columns in order
FEATURE_COLUMNS = [
    'carpet_area_sqft',
    'floor_num',
    'bathroom',
    'balcony',
    'location_grouped',
    'Furnishing',
    'Transaction',
    'Ownership',
    'facing'
]

class ModelService:
    def __init__(self):
        self.model: Optional[Any] = None
        self.locations: List[str] = []

    def load_model_and_locations(self) -> None:
        model_path = settings.resolved_model_path
        locations_path = settings.resolved_locations_path

        logger.info(f"Loading ML model from: {model_path}")
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found at {model_path}")
        
        self.model = joblib.load(model_path)
        logger.info("ML Model successfully loaded into memory.")

        logger.info(f"Loading locations from: {locations_path}")
        if locations_path.exists():
            with open(locations_path, "r", encoding="utf-8") as f:
                self.locations = json.load(f)
            logger.info(f"Loaded {len(self.locations)} locations.")
        else:
            logger.warning(f"Locations file not found at {locations_path}, using default locations list.")
            self.locations = ["ahmedabad", "mumbai", "nagpur", "navi-mumbai", "thane"]

    def is_model_loaded(self) -> bool:
        return self.model is not None

    def get_locations(self) -> List[str]:
        return self.locations

    def format_price_inr(self, amount: float) -> str:
        """Formats raw price in INR into human readable string (Lakhs/Crores)."""
        if amount < 0:
            return "Invalid Price"
        if amount >= 10_000_000:
            crores = amount / 10_000_000
            return f"₹ {crores:.2f} Cr"
        elif amount >= 100_000:
            lakhs = amount / 100_000
            return f"₹ {lakhs:.2f} Lakhs"
        else:
            return f"₹ {amount:,.0f}"

    def predict(self, input_data: HousePredictionInput) -> HousePredictionOutput:
        if not self.is_model_loaded():
            raise RuntimeError("Machine Learning Model is not loaded.")

        # Convert schema input to dict
        data_dict = input_data.model_dump()

        # Construct single-row DataFrame with exact training column order
        df = pd.DataFrame([{col: data_dict[col] for col in FEATURE_COLUMNS}])

        # Perform inference
        prediction_val = float(self.model.predict(df)[0])
        # Ensure prediction is non-negative
        predicted_price = max(0.0, round(prediction_val, 2))
        formatted_price = self.format_price_inr(predicted_price)

        return HousePredictionOutput(
            predicted_price=predicted_price,
            formatted_price=formatted_price,
            currency="INR",
            features_summary=data_dict
        )

# Global singleton service instance
model_service = ModelService()
