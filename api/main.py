from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import joblib

from tensorflow.keras.models import load_model

# =========================
# CARREGAR MODELO E SCALER
# =========================

model = load_model("fraud_model.keras")
scaler = joblib.load("scaler.pkl")

# =========================
# INICIAR API
# =========================

app = FastAPI()

# =========================
# LIBERAR CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# MODELO DOS DADOS
# =========================

class Transaction(BaseModel):
    valor_transacao: float
    hora_transacao: int
    limite_credito: float
    transacoes_anteriores: int

# =========================
# ROTA HOME
# =========================

@app.get("/")
def home():
    return {
        "status": "API ONLINE"
    }

# =========================
# ROTA DE PREVISÃO
# =========================

@app.post("/predict")
def predict(transaction: Transaction):

    # TRANSFORMAR EM DATAFRAME
    data = pd.DataFrame([{
        "valor_transacao": transaction.valor_transacao,
        "hora_transacao": transaction.hora_transacao,
        "limite_credito": transaction.limite_credito,
        "transacoes_anteriores": transaction.transacoes_anteriores
    }])

    # NORMALIZAR
    data_scaled = scaler.transform(data)

    # PREVISÃO
    prediction = model.predict(data_scaled)

    probability = float(prediction[0][0])

    return {
        "fraude_probabilidade": probability,
        "fraude_detectada": probability > 0.5
    }