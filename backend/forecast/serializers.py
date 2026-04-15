from rest_framework import serializers
from .models import SensorData

class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = ['id', 'pm2_5', 'pm10', 'temp', 'humidity', 'co', 'timestamp']

class PredictionRequestSerializer(serializers.Serializer):
    pm2_5 = serializers.FloatField()
    pm10 = serializers.FloatField()
    temp = serializers.FloatField()
    humidity = serializers.FloatField()
    co = serializers.FloatField()
    ts = serializers.DateTimeField()

class PredictionResponseSerializer(serializers.Serializer):
    pm2_5 = serializers.FloatField()
    pm10 = serializers.FloatField()
    temp = serializers.FloatField()
    humidity = serializers.FloatField()
    co = serializers.FloatField()
    timestamp = serializers.DateTimeField()