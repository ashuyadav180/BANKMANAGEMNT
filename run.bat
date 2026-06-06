@echo off
echo ==============================================
echo       STARTING MULEWATCH AI SYSTEM
echo ==============================================

echo 1. Starting Node.js Backend on Port 3001...
start "MuleWatch Backend" cmd /k "cd backend && node server.js"

echo 2. Starting FastAPI AI Service on Port 8000...
start "MuleWatch AI API" cmd /k "cd ml-service && .\venv\Scripts\activate && uvicorn app:app --host 0.0.0.0 --port 8000"

echo 3. Starting React Dashboard on Port 5173...
start "MuleWatch Dashboard" cmd /k "cd frontend && npm run dev"

echo ----------------------------------------------
echo Waiting 5 seconds for servers to initialize...
timeout /t 5 /nobreak > nul

echo 4. Starting Live Data Simulation Feed...
start "MuleWatch Live Feed" cmd /k "cd ml-service && .\venv\Scripts\activate && python simulate_feed.py"

echo ==============================================
echo All 4 terminals have been launched in new windows!
echo Please open your browser to: http://localhost:5173
echo ==============================================
pause
