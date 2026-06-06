import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, create_model
import pandas as pd
import numpy as np
import joblib
import shap
from google import genai
import json

app = FastAPI(title="MuleWatch AI Model API")

# Global variables for model artifacts
artifacts = None
xgb_model = None
iso_forest = None
imputer = None
explainer = None

# Initialize Gemini Client if API key is present
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDqqwEEIRI8ufOpL-ZP5jPP7bGJ9cjDfoE")
client = None
if GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"Failed to initialize Gemini client: {e}")

@app.on_event("startup")
def load_models():
    global artifacts, xgb_model, iso_forest, imputer, explainer
    if not os.path.exists("model_artifacts.pkl"):
        print("model_artifacts.pkl not found. Please train the model first.")
        return
    
    artifacts = joblib.load("model_artifacts.pkl")
    xgb_model = artifacts['xgb']
    iso_forest = artifacts['iso_forest']
    imputer = artifacts['imputer']
    
    # Initialize SHAP explainer
    explainer = shap.TreeExplainer(xgb_model)
    print("Models and Explainer loaded successfully.")

# Create a dynamic Pydantic model for input validation (accepts any fields, but expects the 3924 features)
class AccountFeatures(BaseModel):
    class Config:
        extra = "allow"

@app.get("/")
def health_check():
    return {"status": "healthy", "model_loaded": artifacts is not None}

@app.post("/predict")
def predict(account: AccountFeatures):
    if artifacts is None:
        raise HTTPException(status_code=500, detail="Models not loaded")

    # Convert incoming JSON to DataFrame row
    data_dict = account.model_dump()
    # If any specific field is missing, fill with nan
    df_raw = pd.DataFrame([data_dict])
    
    # Preprocessing
    df = df_raw.copy()
    
    # 1. Null count
    df['null_count'] = df.isnull().sum(axis=1)
    
    # 2. Interaction
    if 'F670' in df.columns and 'F115' in df.columns:
        df['F670_x_F115'] = df['F670'] * df['F115']
    else:
        df['F670_x_F115'] = 0
        
    # Ordinal encode F3889
    if 'F3889' in df.columns:
        age_order = {'L7D':6,'L14D':5,'L31D':4,'L90D':3,'L180D':2,'L365D':1,'G365D':0}
        df['F3889_enc'] = df['F3889'].map(age_order).fillna(0)
    else:
        df['F3889_enc'] = 0
        
    # One-hot encode F2230
    if 'F2230' in df.columns:
        df['F2230_suspicious'] = df['F2230'].isin(['Sep25', 'Nov25', 'Dec25']).astype(int)
    else:
        df['F2230_suspicious'] = 0
        
    # Encode F3893 Segment
    if 'F3893' in df.columns:
        df['F3893_RETAIL'] = (df['F3893'] == 'RETAIL').astype(int)
    else:
        df['F3893_RETAIL'] = 0
    
    # Align columns with training data
    feature_names = artifacts['feature_names']
    for col in feature_names:
        if col not in df.columns:
            df[col] = np.nan
            
    df = df[feature_names]
    
    # Impute
    X_imputed = imputer.transform(df)
    
    # Predict
    xgb_prob = float(xgb_model.predict_proba(X_imputed)[0][1])
    
    # Isolation Forest Anomaly Score
    # score_samples returns negative anomaly score. Lower score = more abnormal
    iso_score = float(-iso_forest.score_samples(X_imputed)[0])
    iso_norm = np.clip((iso_score + 0.5) / 1.0, 0, 1)
    
    # Final Ensemble Risk Score
    risk_score = 0.7 * xgb_prob + 0.3 * iso_norm
    risk_percentage = round(risk_score * 100, 1)
    
    verdict = "HIGH" if risk_percentage > 70 else "MEDIUM" if risk_percentage > 40 else "LOW"
    
    # SHAP Explainer
    shap_vals = explainer.shap_values(X_imputed)[0]
    
    # Get top 5 contributing features
    top_indices = np.argsort(np.abs(shap_vals))[-5:][::-1]
    top_factors = []
    for idx in top_indices:
        feat_name = feature_names[idx]
        val = round(float(shap_vals[idx]), 3)
        orig_val = df[feat_name].iloc[0]
        top_factors.append({
            "feature": feat_name,
            "shap_impact": val,
            "value": None if pd.isna(orig_val) else float(orig_val)
        })
        
    # Gemini Explanation
    explanation = "Account behavior is normal. No deep LLM investigation required." if client else "Gemini API key not configured."
    if client and risk_percentage > 40:
        prompt = (
            f"You are a fraud analyst for a bank. An account has been flagged with a risk score of {risk_percentage}%. "
            f"The top factors contributing to this risk are: {json.dumps(top_factors)}. "
            f"Based on these factors, explain in 2-3 short, clear sentences why this account is suspicious, using plain English suitable for an investigator. "
            f"Do not use markdown, just text."
        )
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            explanation = response.text.strip()
        except Exception as e:
            print(f"Gemini API error: {e}")
            explanation = f"Account flagged due to high SHAP impacts on {top_factors[0]['feature']} and {top_factors[1]['feature']}."
            
    return {
        "risk_score": risk_percentage,
        "verdict": verdict,
        "xgb_confidence": round(xgb_prob * 100, 1),
        "anomaly_score": round(iso_norm * 100, 1),
        "top_factors": top_factors,
        "explanation": explanation
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
