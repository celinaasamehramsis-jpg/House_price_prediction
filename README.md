# 🏠 House Price Prediction - Full-Stack Machine Learning Application

An end-to-end production-grade real estate house price valuation web application powered by **FastAPI**, **scikit-learn**, **React**, **TypeScript**, and **Vite**.

![Application Screenshot Placeholder](https://github.com/user-attachments/assets/4fa92b7b-2ebe-43d8-a90e-3a0da6db0004)


---

## 🌟 Overview & Architecture

This application predicts Indian property market prices based on structural features, location, and property specifications. The machine learning pipeline utilizes a **Random Forest Regressor** trained on real estate market data with automated feature preprocessing pipelines (numerical median imputation & standard scaling + categorical most-frequent imputation & one-hot encoding).

```
┌────────────────────────────────┐         ┌────────────────────────────────┐
│   React + TypeScript Frontend  │ ──────> │       FastAPI Backend API      │
│   (Vite, Modern Glassmorphism) │ <────── │ (Pydantic, Uvicorn, CORS, ML)   │
└────────────────────────────────┘  HTTP   └───────────────┬────────────────┘
                                                           │
                                                           ▼
                                           ┌────────────────────────────────┐
                                           │    scikit-learn ML Pipeline    │
                                           │    (models/house_price.pkl)    │
                                           └────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Backend**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Server**: [Uvicorn](https://www.uvicorn.org/) (ASGI Server)
- **Machine Learning**: [scikit-learn](https://scikit-learn.org/) (**pinned to v1.6.1**) & [joblib](https://joblib.readthedocs.io/)
- **Data Preprocessing**: [pandas](https://pandas.pydata.org/) & [NumPy](https://numpy.org/)
- **Configuration & Validation**: [Pydantic v2](https://docs.pydantic.dev/) & [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)

### **Frontend**
- **Framework**: [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Modern Custom Vanilla CSS (Glassmorphic theme, responsive CSS Grid, Google Fonts)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure Tree

```
House_price_prediction/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       └── prediction.py      # /predict and /locations route handlers
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py              # Pydantic Settings & environment loader
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── prediction.py          # Input/Output Pydantic data schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── prediction_service.py  # Preprocessing & model inference service
│   │   ├── __init__.py
│   │   └── main.py                    # FastAPI entrypoint, lifespan & CORS
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── predictionClient.ts    # Fetch client wrapper for backend API
│   │   ├── components/
│   │   │   ├── PredictionForm.tsx     # Interactive input form with validation
│   │   │   └── ResultDisplay.tsx      # Valuation card & summary display
│   │   ├── types/
│   │   │   └── prediction.ts          # TypeScript interfaces
│   │   ├── App.tsx                    # Main layout container & status monitor
│   │   ├── index.css                  # Modern glassmorphism CSS design system
│   │   ├── main.tsx                   # React root mount point
│   │   └── vite-env.d.ts              # Vite environment type declarations
│   ├── .env                           # Frontend runtime environment configuration
│   ├── .env.example                   # Example frontend environment variables
│   ├── index.html                     # HTML head, fonts, & root node
│   ├── package.json                   # React project dependencies & scripts
│   ├── tsconfig.json                  # TypeScript compiler options
│   └── vite.config.ts                 # Vite dev server configuration
├── models/
│   └── house_price.pkl                # Trained scikit-learn model artifact
├── docs/
│   └── screenshots/                   # Application screenshots
├── locations.json                     # Supported locations list
├── house_price_prediction.ipynb       # Jupyter training notebook
├── house_prices.csv                   # Raw training dataset
├── requirements.txt                   # Root Python dependencies (pinned scikit-learn)
├── .env.example                       # Root backend environment template
├── .env                               # Root environment configuration
├── .gitignore                         # Version control ignore definitions
└── README.md                          # Project documentation
```

---

## 📊 Dataset & Download Instructions

The model was trained on Indian real estate market data featuring residential properties across major metropolitan cities.

- **Dataset File**: `house_prices.csv`
- **Primary Source**: Real estate listings dataset covering property dimensions, structural counts, ownership status, facing direction, and transaction categories.
- **Features Used**:
  - `carpet_area_sqft`: Property area in square feet.
  - `floor_num`: Floor number.
  - `bathroom`: Number of bathrooms.
  - `balcony`: Number of balconies.
  - `location_grouped`: City / neighborhood location category.
  - `Furnishing`: Furnishing status (`Furnished`, `Semi-Furnished`, `Unfurnished`).
  - `Transaction`: Transaction type (`Resale`, `New Property`).
  - `Ownership`: Property tenure (`Freehold`, `Co-operative Society`, `Power Of Attorney`, `Leasehold`).
  - `facing`: Property facing direction (`East`, `West`, `North - East`, etc.).

---

## 📈 Model Performance Metrics

The trained **Random Forest Regressor** model achieved the following performance metrics on the test dataset:

| Metric | Value | Description |
| :--- | :--- | :--- |
| **Mean Absolute Error (MAE)** | `₹ 4,572,825.39` | Average prediction deviation in INR |
| **Root Mean Squared Error (RMSE)** | `₹ 11,334,678.86` | Standard deviation of prediction residuals |
| **R² Score (Coefficient of Determination)** | `0.7797` (~78%) | Variance explained by the model |

*Note: The model was saved using **`scikit-learn==1.6.1`**.*

---

## ⚙️ Environment Variables

### Root / Backend Environment (`.env`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `HOST` | string | `0.0.0.0` | Host IP for FastAPI server |
| `PORT` | integer | `8000` | Port for FastAPI server |
| `MODEL_PATH` | string | `models/house_price.pkl` | Relative/Absolute path to model file |
| `LOCATIONS_PATH` | string | `locations.json` | Relative/Absolute path to locations file |
| `CORS_ORIGINS` | string | `http://localhost:5173` | Comma-separated allowed CORS origins |

### Frontend Environment (`frontend/.env`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | string | `http://localhost:8000` | Base URL of the backend FastAPI service |

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Python**: `3.10` or higher
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

---

### Step 1: Backend Setup (FastAPI)

1. **Create and activate a virtual environment**:
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate

   # On macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   > ⚠️ **Important**: Ensure `scikit-learn==1.6.1` is installed to match the pickle format of `house_price.pkl`.

3. **Verify Environment Configuration**:
   Create a `.env` file from the template if not present:
   ```bash
   cp .env.example .env
   ```

4. **Run the FastAPI Server**:
   ```bash
   python -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   The backend service will start at **`http://localhost:8000`**.
   - Interactive Swagger API Docs: `http://localhost:8000/docs`
   - ReDoc Documentation: `http://localhost:8000/redoc`

---

### Step 2: Frontend Setup (React + TypeScript + Vite)

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node modules**:
   ```bash
   npm install
   ```

3. **Configure Environment File**:
   Ensure `frontend/.env` exists:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at **`http://localhost:5173`**.

---

## 📡 API Reference & cURL Example

### 1. Predict House Price Endpoint
- **URL**: `/predict` or `/api/v1/predict`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`

#### **Sample Request Body**
```json
{
  "carpet_area_sqft": 1250.0,
  "floor_num": 5,
  "bathroom": 2,
  "balcony": 1,
  "location_grouped": "mumbai",
  "Furnishing": "Semi-Furnished",
  "Transaction": "Resale",
  "Ownership": "Freehold",
  "facing": "East"
}
```

#### **cURL Command**
```bash
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{
       "carpet_area_sqft": 1250.0,
       "floor_num": 5,
       "bathroom": 2,
       "balcony": 1,
       "location_grouped": "mumbai",
       "Furnishing": "Semi-Furnished",
       "Transaction": "Resale",
       "Ownership": "Freehold",
       "facing": "East"
     }'
```

#### **Sample Response**
```json
{
  "predicted_price": 14500000.0,
  "formatted_price": "₹ 1.45 Cr",
  "currency": "INR",
  "features_summary": {
    "carpet_area_sqft": 1250.0,
    "floor_num": 5,
    "bathroom": 2,
    "balcony": 1,
    "location_grouped": "mumbai",
    "Furnishing": "Semi-Furnished",
    "Transaction": "Resale",
    "Ownership": "Freehold",
    "facing": "East"
  }
}
```

---

### 2. Get Available Locations Endpoint
- **URL**: `/api/v1/locations`
- **Method**: `GET`

#### **cURL Command**
```bash
curl -X GET "http://localhost:8000/api/v1/locations"
```

#### **Sample Response**
```json
{
  "locations": ["ahmedabad", "mumbai", "nagpur", "navi-mumbai", "thane"],
  "total": 5
}
```

---

### 3. Health Check Endpoint
- **URL**: `/health`
- **Method**: `GET`

#### **cURL Command**
```bash
curl -X GET "http://localhost:8000/health"
```

#### **Sample Response**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

---

## 🖼️ Application Screenshots

### Main Interface & Valuation Form
![Main Interface Placeholder](docs/screenshots/form_interface.png)

### Prediction Output & Summary Breakdown
![Prediction Output Placeholder](docs/screenshots/prediction_result.png)

---

## 📜 License & Acknowledgments

- Trained model algorithm: Random Forest Regressor
- Built for educational & commercial demonstration purposes.
