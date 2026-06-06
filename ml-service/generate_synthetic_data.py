import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta
import random

def generate_synthetic_data(output_path="data/DataSet.csv", num_rows=9082, num_fraud=81, num_features=3925):
    """Generates synthetic data mirroring the hackathon dataset statistics."""
    print("Generating synthetic data...")
    np.random.seed(42)
    random.seed(42)
    
    df = pd.DataFrame()
    
    # Target column (F3924): 1 for fraud, 0 for legit
    labels = np.zeros(num_rows)
    fraud_indices = np.random.choice(num_rows, num_fraud, replace=False)
    labels[fraud_indices] = 1
    
    # Core numerical features
    # F670: fraud mean 2.6x legit (e.g. 0.09 vs 0.23)
    f670 = np.random.normal(0.09, 0.02, num_rows)
    f670[fraud_indices] = np.random.normal(0.23, 0.05, num_fraud)
    df['F670'] = f670
    
    # F115: fraud median 0.73 vs legit 0.52
    f115 = np.random.normal(0.52, 0.1, num_rows)
    f115[fraud_indices] = np.random.normal(0.73, 0.1, num_fraud)
    df['F115'] = f115
    
    # Generate some random numerical key features (F321, F527, F3894)
    df['F321'] = np.random.normal(1.0, 0.5, num_rows)
    df['F527'] = np.random.normal(50.0, 10.0, num_rows)
    df['F3894'] = np.random.normal(100.0, 20.0, num_rows)
    
    # Special Categorical Features
    # F2230: Month. Sep25, Nov25, Dec25 = high fraud
    months = ['Jan25', 'Feb25', 'Mar25', 'Apr25', 'May25', 'Jun25', 'Jul25', 'Aug25', 'Sep25', 'Oct25', 'Nov25', 'Dec25']
    df['F2230'] = np.random.choice(months, num_rows)
    # Inject 100% fraud rate for Sep25, Nov25, Dec25 in fraud indices, and remove them from legit
    df.loc[labels == 0, 'F2230'] = np.random.choice(['Jan25', 'Feb25', 'Mar25', 'Apr25', 'May25', 'Jun25', 'Jul25', 'Aug25', 'Oct25'], num_rows - num_fraud)
    df.loc[fraud_indices, 'F2230'] = np.random.choice(['Sep25', 'Nov25', 'Dec25'], num_fraud)
    
    # F3886: Account Type
    acc_types = ['Savings', 'Current', 'MSME Medium', 'Corporate', 'Joint']
    df['F3886'] = np.random.choice(acc_types, num_rows)
    # Savings and MSME medium highest risk
    df.loc[fraud_indices, 'F3886'] = np.random.choice(['Savings', 'MSME Medium'], num_fraud, p=[0.7, 0.3])
    
    # F3888: Account Open Date (Date String)
    base_date = datetime(2025, 1, 1)
    dates = [base_date - timedelta(days=random.randint(1, 400)) for _ in range(num_rows)]
    # Fraudsters tend to have newer accounts
    for idx in fraud_indices:
        dates[idx] = base_date - timedelta(days=random.randint(1, 30))
    df['F3888'] = [d.strftime("%Y-%m-%d") for d in dates]
    
    # F3889: Account age bucket
    def get_bucket(days):
        if days <= 7: return 'L7D'
        if days <= 14: return 'L14D'
        if days <= 31: return 'L31D'
        if days <= 90: return 'L90D'
        if days <= 180: return 'L180D'
        if days <= 365: return 'L365D'
        return 'G365D'
    df['F3889'] = [(base_date - datetime.strptime(d, "%Y-%m-%d")).days for d in df['F3888']]
    df['F3889'] = df['F3889'].apply(get_bucket)
    
    # F3890: Geography (M, SU, R, U)
    df['F3890'] = np.random.choice(['M', 'SU', 'R', 'U'], num_rows)
    df.loc[fraud_indices, 'F3890'] = np.random.choice(['R', 'SU'], num_fraud, p=[0.8, 0.2])
    
    # F3891: Occupation
    occupations = ['salaried', 'student', 'self_employed', 'retired', 'unemployed']
    df['F3891'] = np.random.choice(occupations, num_rows)
    df.loc[fraud_indices, 'F3891'] = np.random.choice(['student', 'unemployed'], num_fraud, p=[0.8, 0.2])
    
    # F3892: Gender (M, F, O)
    df['F3892'] = np.random.choice(['M', 'F', 'O'], num_rows, p=[0.5, 0.45, 0.05])
    
    # F3893: Segment (RETAIL, CORPORATE)
    df['F3893'] = np.random.choice(['RETAIL', 'CORPORATE'], num_rows, p=[0.8, 0.2])
    df.loc[fraud_indices, 'F3893'] = 'RETAIL' # Retail is 6x more fraudulent
    
    print("Generating sparse and noisy features...")
    # Add dummy sparse features to simulate 1138 dropped
    for i in range(1138):
        # 60% null values
        col_name = f'F_sparse_{i}'
        data = np.random.normal(0, 1, num_rows)
        data[np.random.choice(num_rows, int(num_rows * 0.6), replace=False)] = np.nan
        df[col_name] = data
        
    # Fill up the rest of the 3924 features with random noise (mostly non-null)
    current_cols = len(df.columns)
    remaining = num_features - current_cols - 1 # -1 for target
    for i in range(remaining):
        col_name = f'F_noise_{i}'
        df[col_name] = np.random.normal(0, 1, num_rows)
        
    # Target column must be at the end as F3924
    df['F3924'] = labels
    
    # Make sure we don't have exactly 3924 features in code logic, just match the number of columns.
    # We rename columns to F0...F3923 where appropriate.
    cols = df.columns.tolist()
    # Ensure specific columns keep their names, rename the rest.
    reserved = ['F670', 'F115', 'F321', 'F527', 'F3894', 'F2230', 'F3886', 'F3888', 'F3889', 'F3890', 'F3891', 'F3892', 'F3893', 'F3924']
    rename_mapping = {}
    f_counter = 0
    for col in cols:
        if col not in reserved:
            while f'F{f_counter}' in reserved:
                f_counter += 1
            rename_mapping[col] = f'F{f_counter}'
            f_counter += 1
    
    df = df.rename(columns=rename_mapping)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Data saved to {output_path} with {len(df.columns)} columns and {len(df)} rows.")

if __name__ == "__main__":
    generate_synthetic_data()
