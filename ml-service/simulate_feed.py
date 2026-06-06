import pandas as pd
import time
import requests
import json
import sys

def simulate_feed(data_path="data/DataSet.csv", endpoint="http://localhost:3001/api/predict", delay=3.0):
    print(f"Loading data from {data_path}...")
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: {data_path} not found.")
        sys.exit(1)
        
    print(f"Loaded {len(df)} records. Starting simulation to {endpoint} with {delay}s delay...")
    
    # Shuffle the dataframe to simulate real-world arrival
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    for idx, row in df.iterrows():
        # Drop target column for prediction
        payload = row.drop(labels=['F3924']).to_dict()
        
        # Replace NaN with None for JSON serialization
        payload = {k: (None if pd.isna(v) else v) for k, v in payload.items()}
        
        # Add account_id for tracing
        payload['account_id'] = f"ACC-{idx:05d}"
        
        try:
            start_time = time.time()
            response = requests.post(endpoint, json=payload, timeout=5.0)
            elapsed = time.time() - start_time
            
            if response.status_code == 200:
                result = response.json()
                verdict = result.get('verdict')
                score = result.get('risk_score')
                
                if verdict == 'HIGH':
                    print(f"\033[91m[ALERT] ACC-{idx:05d} | Risk: {score}% | Verdict: {verdict} | Time: {elapsed:.2f}s\033[0m")
                elif verdict == 'MEDIUM':
                    print(f"\033[93m[WARN]  ACC-{idx:05d} | Risk: {score}% | Verdict: {verdict} | Time: {elapsed:.2f}s\033[0m")
                else:
                    print(f"[INFO]  ACC-{idx:05d} | Risk: {score}% | Verdict: {verdict} | Time: {elapsed:.2f}s")
                    
            else:
                print(f"Error {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"Connection error: {e}")
            print("Make sure the FastAPI server is running.")
            break
            
        time.sleep(delay)

if __name__ == "__main__":
    simulate_feed()
