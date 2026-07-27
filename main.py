from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import json

app = FastAPI(title="House Price Prediction API", version="1.0")

# Load model and locations
model = joblib.load("../house_price.pkl")
locations = json.load(open("../locations.json"))

class HouseFeatures(BaseModel):
    carpet_area_sqft: float
    floor_num: int
    bathroom: int
    balcony: int
    location_grouped: str
    Furnishing: str
    Transaction: str
    Ownership: str
    facing: str

@app.get("/")
def home():
    return {"message": "House Price Prediction Backend is Running!"}

@app.post("/predict")
def predict_price(features: HouseFeatures):
    data = pd.DataFrame([features.dict()])
    prediction = model.predict(data)[0]
    return {"predicted_price": round(float(prediction), 2)}
