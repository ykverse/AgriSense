import os
import json
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for frontend integration
CORS(app)

# --- Global Variables for Preloaded Data ---
MODEL = None
MARKET_DATA = None

def load_resources():
    global MODEL, MARKET_DATA
    
    # Get arbitrary absolute paths based on app.py location
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'soil_model.pkl')
    market_path = os.path.join(base_dir, 'market_trend.json')
    
    # Load Model
    try:
        MODEL = joblib.load(model_path)
        print("Soil model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        
    # Load Market Data
    try:
        with open(market_path, 'r') as f:
            MARKET_DATA = json.load(f)
        print("Market trend data loaded successfully.")
    except Exception as e:
        print(f"Error loading market data: {e}")

# Load resources right when the app starts
load_resources()

@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "ok", "message": "Smart Crop Recommendation API is running. Use POST /predict for inference."}), 200

# VALID_RANGES: (min, max) for each agricultural feature
VALID_RANGES = {
    'N': (0, 200),
    'P': (0, 200),
    'K': (0, 200),
    'temperature': (5, 45),
    'humidity': (10, 100),
    'ph': (3.5, 9),
    'rainfall': (0, 5000)
}

def validate_input(data):
    """
    Validates the incoming JSON data to ensure physical and agricultural plausibility.
    Returns: (error_dict, status_code) if validation fails, else (None, None)
    """
    if not isinstance(data, dict):
        return {"error": "Invalid input type"}, 400
        
    required_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    
    # 1. Existence & Type Safety Check
    for feature in required_features:
        if feature not in data:
            return {"error": f"Missing required numeric field: {feature}"}, 400
        try:
            val = float(data[feature])
            data[feature] = val  # Store back as float for easier downstream processing
        except (ValueError, TypeError):
            return {"error": "Invalid input type"}, 400

    # 2. Scientific Range Constraints
    for feature in required_features:
        val = data[feature]
        min_val, max_val = VALID_RANGES[feature]
        if not (min_val <= val <= max_val):
            return {"error": f"{feature} value out of realistic range"}, 400

    # 3. Zero-Value Rejection
    # If all inputs are exactly 0, it's an unrealistic/impossible scenario
    if all(data[feature] == 0 for feature in required_features):
        return {"error": "Input values are unrealistic"}, 400
        
    # Validation passed
    return None, None

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON payload provided'}), 400

        # >>> 1. Strict Agricultural Validation Layer <<<
        error_response, status_code = validate_input(data)
        if error_response:
            return jsonify(error_response), status_code
            
        # Exact feature order required by the model
        required_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

        # 2. Convert input to DataFrame exactly matching the training feature schema
        input_data = {feature: [float(data[feature])] for feature in required_features}
        df = pd.DataFrame(input_data)

        # 3. Model Prediction (Probabilities for all crops)
        if MODEL is None:
            return jsonify({'error': 'Model not loaded properly on server.'}), 500
            
        probabilities = MODEL.predict_proba(df)[0]
        classes = MODEL.classes_
        
        # 4. Processing logic: combine suitability with market trends
        results = []
        for i, crop_name in enumerate(classes):
            suitability_score = probabilities[i] * 100 # Convert to percentage
            
            # Map probabilities to market trends if found, else default values
            market_info = MARKET_DATA.get(crop_name, {"direction": "STABLE", "percent_change": 0.0})
            market_percent = market_info['percent_change']
            market_direction = market_info['direction']
            
            # Formula: final_score = suitability * (1 + market_percent / 100)
            final_score = suitability_score * (1 + market_percent / 100)
            
            results.append({
                "crop": crop_name,
                "suitability": round(suitability_score, 2),
                "market_direction": market_direction,
                "market_percent": round(market_percent, 2),
                "final_score": round(final_score, 2)
            })

        # 5. Sorting
        sort_param = request.args.get('sort', default='suitability')
        if sort_param == 'market':
            results.sort(key=lambda x: x['final_score'], reverse=True)
        else:
            # Default sorting by suitability DESC
            results.sort(key=lambda x: x['suitability'], reverse=True)

        return jsonify(results), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Running on standard local port with debug mode
    app.run(debug=True, host='0.0.0.0', port=5000)
