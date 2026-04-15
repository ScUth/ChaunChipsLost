from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import F
from sensor.models import Sensor
from .serializers import PredictionRequestSerializer, PredictionResponseSerializer
from .services.ml_service import predictor
from django.utils.timezone import now
from datetime import timedelta

class TrainModelAPIView(APIView):
    """Endpoint to train the model with historical data"""
    
    def post(self, request):
        # Get last 1000 records for training
        historical_data = Sensor.objects.order_by('-ts')[:1000]
        
        if historical_data.count() < 50:
            return Response({
                'error': 'Need at least 50 historical records to train model'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # We need the key to be 'timestamp' for the ML predictor, so we alias 'ts' to 'timestamp'
        data_list = list(historical_data.values('pm2_5', 'pm10', 'temp', 'humidity', 'co', timestamp=F('ts')))
        
        try:
            predictor.train_models(data_list)
            return Response({
                'message': 'Model trained successfully',
                'records_used': len(data_list)
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PredictAPIView(APIView):
    """Endpoint to predict next hour values"""
    
    def post(self, request):
        # Validate input
        serializer = PredictionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        current_data = serializer.validated_data
        
        # Get last 3 hours of historical data from database
        three_hours_ago = now() - timedelta(hours=3)
        recent_history = Sensor.objects.filter(
            ts__gte=three_hours_ago
        ).order_by('ts')
        
        if recent_history.count() < 2:
            return Response({
                'warning': 'Limited historical data available, predictions may be less accurate',
                'history_count': recent_history.count()
            })
        
        history_list = list(recent_history.values('pm2_5', 'pm10', 'temp', 'humidity', 'co', timestamp=F('ts')))
        
        try:
            predictions = predictor.predict_next_hour(current_data, history_list)
            
            # Optionally save the prediction
            # PredictionResult.objects.create(**predictions)
            
            return Response(predictions)
        except Exception as e:
            return Response({
                'error': f'Prediction failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PredictFromLastReadingAPIView(APIView):
    """Predict using the most recent sensor reading in database"""
    
    def get(self, request):
        last_reading = Sensor.objects.order_by('-ts').first()
        
        if not last_reading:
            return Response({
                'error': 'No sensor data available'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get recent history as lag defaults
        # Grab the newest 3 elements, then reverse them so they match chronological order (oldest to newest)
        recent_history = Sensor.objects.order_by('-ts')[:3]
        history_list = list(recent_history.values('pm2_5', 'pm10', 'temp', 'humidity', 'co', timestamp=F('ts')))
        history_list.reverse()
        
        current_data = {
            'pm2_5': last_reading.pm2_5,
            'pm10': last_reading.pm10,
            'temp': last_reading.temp,
            'humidity': last_reading.humidity,
            'co': last_reading.co,
            'ts': last_reading.ts
        }
        
        try:
            predictions = predictor.predict_next_hour(current_data, history_list)
            return Response(predictions)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)