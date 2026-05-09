# 🛡️ DeepAudit AI — Antifraude para Fintechs

O **DeepAudit** é uma solução fullstack de detecção de fraude que utiliza redes neurais profundas (**Deep Learning**) para analisar transações financeiras em tempo real. Este projeto foi desenvolvido para demonstrar a integração de modelos de IA complexos com APIs de alta performance e interfaces modernas.

## 🚀 Tecnologias
- **IA:** TensorFlow, Keras, Scikit-Learn, Pandas.
- **Backend:** Python & FastAPI.
- **Frontend:** Next.js 14, Tailwind CSS, Lucide React, Recharts.
- **DevOps:** Docker (opcional), Uvicorn.

## 🧠 O Modelo de IA
O modelo utiliza uma arquitetura de rede neural densa para classificação binária. Ele foi treinado com dados normalizados para identificar padrões suspeitos baseados em:
- Valor da transação vs. Limite de crédito.
- Horário da operação (detecção de anomalias noturnas).
- Histórico de comportamento do usuário.

## 🛠️ Como Executar
### 1. API (Backend)
```bash
cd api
pip install -r ../requirements.txt
uvicorn main:app --reload