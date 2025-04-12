from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from mppt import enhanced_po_mppt
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust for deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulationData(BaseModel):
    voltage: List[float]
    current: List[float]

@app.post("/simulate/")
async def simulate(data: SimulationData):
    try:
        return enhanced_po_mppt(data.voltage, data.current)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Simulation failed: {str(e)}")

@app.post("/upload/")
async def upload(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    try:
        df = pd.read_csv(file.file)
        if df.shape[1] < 2:
            raise HTTPException(status_code=400, detail="CSV must have at least two columns (voltage, current).")
        voltage = df.iloc[:, 0].tolist()
        current = df.iloc[:, 1].tolist()
        return enhanced_po_mppt(voltage, current)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process file: {str(e)}")
