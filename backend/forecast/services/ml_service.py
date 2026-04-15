import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
from django.conf import settings
import os
from datetime import datetime

class AirQualityPredictor:
    def __init__(self):
        self.models = {}
        self.feature_names = None
        self.model_path = settings.BASE_DIR / 'ml_models'
        
    def train_models(self, historical_data):
        """
        historical_data: List of dicts with keys: 
        pm2_5, pm10, temp, humidity, co, timestamp
        """
        df = pd.DataFrame(historical_data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        
        # Create lag features
        for var in ['pm2_5', 'pm10', 'temp', 'humidity', 'co']:
            df[f'{var}_lag1'] = df[var].shift(1)
            df[f'{var}_lag2'] = df[var].shift(2)
            df[f'{var}_lag3'] = df[var].shift(3)
        
        # Time features
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        
        # Create target (next hour)
        for var in ['pm2_5', 'pm10', 'temp', 'humidity', 'co']:
            df[f'{var}_next'] = df[var].shift(-1)
        
        # Feature columns
        feature_cols = [col for col in df.columns if 'lag' in col] + ['hour', 'day_of_week']
        self.feature_names = feature_cols
        
        # Drop NaN rows
        df_clean = df.dropna()
        
        X = df_clean[feature_cols]
        
        # Train one model per variable
        for var in ['pm2_5', 'pm10', 'temp', 'humidity', 'co']:
            y = df_clean[f'{var}_next']
            rf = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
            rf.fit(X, y)
            self.models[var] = rf
        
        # Save models
        self.save_models()
        
        return True
    
    def predict_next_hour(self, current_data, recent_history):
        """
        current_data: dict with current sensor reading
        recent_history: list of dicts (last 3 hours of data)
        """
        if not self.models or not self.feature_names:
            self.load_models()
        
        # Prepare features
        features = {}
        
        # Add recent history as lag features
        for lag in [1, 2, 3]:
            if len(recent_history) >= lag:
                lag_data = recent_history[-lag]
                for var in ['pm2_5', 'pm10', 'temp', 'humidity', 'co']:
                    features[f'{var}_lag{lag}'] = float(lag_data[var])
            else:
                # Fallback to current value if history missing
                for var in ['pm2_5', 'pm10', 'temp', 'humidity', 'co']:
                    features[f'{var}_lag{lag}'] = float(current_data[var])
        
        # Time features from current timestamp
        timestamp = pd.to_datetime(current_data.get('ts') or current_data.get('timestamp'))
        features['hour'] = timestamp.hour
        features['day_of_week'] = timestamp.dayofweek
        
        # Create DataFrame with correct column order
        X = pd.DataFrame([features])
        X = X[self.feature_names]
        
        # Predict
        predictions = {}
        for var in ['pm2_5', 'pm10', 'temp', 'humidity', 'co']:
            predictions[var] = round(float(self.models[var].predict(X)[0]), 2)
        
        predictions['timestamp'] = (timestamp + pd.Timedelta(hours=1)).isoformat()
        
        return predictions
    
    def save_models(self):
        """Save models to disk"""
        os.makedirs(self.model_path, exist_ok=True)
        for var, model in self.models.items():
            joblib.dump(model, self.model_path / f'{var}_model.pkl')
        joblib.dump(self.feature_names, self.model_path / 'feature_names.pkl')
    
    def load_models(self):
        """Load models from disk"""
        for var in ['pm2_5', 'pm10', 'temp', 'humidity', 'co']:
            model_file = self.model_path / f'{var}_model.pkl'
            if model_file.exists():
                self.models[var] = joblib.load(model_file)
        feature_file = self.model_path / 'feature_names.pkl'
        if feature_file.exists():
            self.feature_names = joblib.load(feature_file)

# Singleton instance
predictor = AirQualityPredictor()