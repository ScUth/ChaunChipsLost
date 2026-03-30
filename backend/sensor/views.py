from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Sensor
from .serializer import SensorSerializers

@api_view(['GET'])
def latest_sensor(request):
    data = Sensor.objects.order_by('-ts').first()
    if data is None:
        return Response({'error': 'No data found'}, status=404)
    serializer = SensorSerializers(data)
    return Response(serializer.data)
