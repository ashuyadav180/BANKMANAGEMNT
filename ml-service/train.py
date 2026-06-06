import pandas as pd
import numpy as np
import joblib
from xgboost import XGBClassifier
from sklearn.ensemble import IsolationForest
from sklearn.impute import SimpleImputer
from sklearn.model_selection import StratifiedKFold
from imblearn.over_sampling import SMOTE
from sklearn.metrics import roc_auc_score, f1_score, precision_score, recall_score
import shap

def train_model():
    print("Loading data...")
    df = pd.read_csv("data/DataSet.csv")
    
    # Separate features and target
    X_raw = df.drop(columns=['F3924'])
    y = df['F3924']
    print(f"Data shape: {X_raw.shape}, Target distribution: {y.value_counts().to_dict()}")

    print("Step 1: Feature Engineering...")
    # Drop features with >50% nulls
    null_percentages = X_raw.isnull().sum() / len(X_raw)
    cols_to_drop = null_percentages[null_percentages > 0.5].index
    print(f"Dropping {len(cols_to_drop)} sparse features...")
    X = X_raw.drop(columns=cols_to_drop).copy()
    
    # Save the remaining feature names
    feature_names = X.columns.tolist()

    # Derived Features
    print("Creating derived features...")
    # 1. Null count per row
    X['null_count'] = X.isnull().sum(axis=1)
    
    # 2. Interaction feature F670 x F115
    if 'F670' in X.columns and 'F115' in X.columns:
        X['F670_x_F115'] = X['F670'] * X['F115']
    
    # Ordinal encode F3889 (Account age bucket)
    if 'F3889' in X.columns:
        age_order = {'L7D':6,'L14D':5,'L31D':4,'L90D':3,'L180D':2,'L365D':1,'G365D':0}
        X['F3889_enc'] = X['F3889'].map(age_order).fillna(0)
    
    # One-hot encode F2230
    if 'F2230' in X.columns:
        X['F2230_suspicious'] = X['F2230'].isin(['Sep25', 'Nov25', 'Dec25']).astype(int)
    
    # Encode F3893 Segment
    if 'F3893' in X.columns:
        X['F3893_RETAIL'] = (X['F3893'] == 'RETAIL').astype(int)
        
    # Drop the original categorical columns that were engineered manually
    cat_cols_to_drop = ['F2230', 'F3886', 'F3888', 'F3889', 'F3890', 'F3891', 'F3892', 'F3893']
    existing_cat_cols = [c for c in cat_cols_to_drop if c in X.columns]
    X = X.drop(columns=existing_cat_cols)
    
    final_feature_names = X.columns.tolist()
    
    print("Step 2: Imputation...")
    imputer = SimpleImputer(strategy='median')
    X_imputed = imputer.fit_transform(X)
    X_imputed_df = pd.DataFrame(X_imputed, columns=final_feature_names)
    
    # Evaluation with StratifiedKFold
    print("Evaluating with StratifiedKFold...")
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    auc_scores = []
    f1_scores = []
    
    for train_idx, val_idx in skf.split(X_imputed_df, y):
        X_train, X_val = X_imputed_df.iloc[train_idx], X_imputed_df.iloc[val_idx]
        y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]
        
        # SMOTE on training fold only
        smote = SMOTE(sampling_strategy=0.5, random_state=42)
        X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
        
        xgb = XGBClassifier(
            n_estimators=100, max_depth=6, learning_rate=0.05,
            scale_pos_weight=111, subsample=0.8, colsample_bytree=0.8,
            random_state=42, n_jobs=-1
        )
        xgb.fit(X_train_resampled, y_train_resampled)
        
        y_pred = xgb.predict(X_val)
        y_prob = xgb.predict_proba(X_val)[:, 1]
        
        auc_scores.append(roc_auc_score(y_val, y_prob))
        f1_scores.append(f1_score(y_val, y_pred))

    print(f"Validation Mean AUC: {np.mean(auc_scores):.4f}")
    print(f"Validation Mean F1: {np.mean(f1_scores):.4f}")

    print("Step 3: Training Final Models...")
    # Train on full dataset
    smote_full = SMOTE(sampling_strategy=0.5, random_state=42)
    X_full_resampled, y_full_resampled = smote_full.fit_resample(X_imputed_df, y)
    
    final_xgb = XGBClassifier(
        n_estimators=500, max_depth=6, learning_rate=0.03,
        scale_pos_weight=111, subsample=0.8, colsample_bytree=0.8,
        random_state=42, n_jobs=-1
    )
    final_xgb.fit(X_full_resampled, y_full_resampled)
    
    iso_forest = IsolationForest(contamination=0.01, random_state=42)
    iso_forest.fit(X_imputed_df)
    
    print("Step 4: Creating SHAP Explainer...")
    # Use a subset of data for SHAP explainer background if needed, but TreeExplainer works without it
    explainer = shap.TreeExplainer(final_xgb)

    print("Saving models and artifacts...")
    joblib.dump({
        'imputer': imputer,
        'xgb': final_xgb,
        'iso_forest': iso_forest,
        'feature_names': final_feature_names,
        'cols_to_drop': cols_to_drop,
        'cat_cols_to_drop': existing_cat_cols
    }, "model_artifacts.pkl")
    
    print("Training pipeline complete.")

if __name__ == "__main__":
    train_model()
