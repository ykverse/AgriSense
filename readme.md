# AgriSense 🌿

A web app that helps farmers in **Wayanad, Kerala** decide what to grow — by combining soil analysis with market price forecasting into a single ranked recommendation.

Enter your soil parameters, get a ranked list of crops sorted by both how well they grow in your soil *and* whether prices are trending up or down over the next few months.

> Built as a final year BSc CS project at NMSM Govt. College Kalpetta · University of Calicut · 2026

---

## Screenshots

> _Add your screenshots here_

| Dashboard | Results — Soil Match | Results — Market Profit |
|---|---|---|
| ![dashboard](images/screenshots/dashboard.png) | ![soil](images/screenshots/soilresult.png) | ![market](images/screenshots/marketresult.png) |

---

## Video Demo

[![Watch Demo](https://img.shields.io/badge/Watch%20Demo-%23FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/your-demo-link)

---

## How it works

1. You enter 7 soil/climate values — N, P, K, Temperature, Humidity, pH, Rainfall
2. A trained **Random Forest** model scores how suitable each crop is for those conditions
3. A **SARIMA** time-series model (trained on 2020–2025 AGMARK price data) forecasts the next 3-month price trend for each crop
4. Both scores are combined → crops are ranked by profitability

You can toggle between **Soil Match** (pure agronomic ranking) and **Market Profit** (price-adjusted ranking) in the results panel.

---

## Project Structure

```
AgriSense/
├── index.html              # Frontend — dashboard UI
├── css/
│   └── style.css           # Styles
├── script/
│   └── main.js             # Fetch logic, result rendering, chart
├── backend/
│   ├── app.py              # Flask API — /predict endpoint
│   ├── soil_dataset_model.pkl   # Trained Random Forest model
│   └── market_trend.json   # Precomputed SARIMA market scores
├── datasets/
│   ├── soil_dataset.csv    # 1250 records, 5 crops, 7 features
│   └── market_prices/      # Per-commodity AGMARK price CSVs
├── ipynb/
│   ├── soil_model_training.ipynb
│   └── market_forecast_training.ipynb
├── images/                 # Crop images for result cards
└── icons/                  # UI icons
```

---

## Architecture

```
Browser (index.html)
    │
    │  POST /predict  {N, P, K, temp, humidity, pH, rainfall}
    ▼
Flask (app.py)
    ├── Load soil_dataset_model.pkl
    │       └── Random Forest → suitability probability per crop
    ├── Load market_trend.json
    │       └── SARIMA % change per crop (pre-computed)
    └── Integration formula
            FinalScore = (0.75 × Suitability) + (0.5 × MarketScore × 5)
    │
    │  JSON response  [{crop, suitability, market_trend, final_score}, ...]
    ▼
Browser renders ranked cards
Toggle: sort by suitability  ↔  sort by final_score
```

---

## Stack

- **Backend** — Python, Flask
- **ML** — Scikit-learn (Random Forest), Statsmodels (SARIMA)
- **Data** — Pandas, NumPy
- **Frontend** — HTML, CSS, Vanilla JS
- **Notebooks** — Jupyter / Google Colab

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/ykverse/AgriSense.git
cd AgriSense

# 2. Install dependencies
pip install flask scikit-learn pandas numpy statsmodels joblib

# 3. Start the backend
cd backend
python app.py
# → running on http://127.0.0.1:5000

# 4. Open the frontend
# Just open index.html in your browser
```

The frontend calls `http://127.0.0.1:5000/predict` — make sure the Flask server is running first.

---

## Supported Crops

Banana · Coffee · Ginger · Pepper · Tapioca

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.

1. Fork the repo
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

