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

@api_view(['GET'])
def latest_n_sensor(request, n):
    try:
        n = int(n)
        n = min(n, 10)
    except:
        return Response({'error': 'Invalid n'}, status=400)

    data = Sensor.objects.order_by('-ts')[:n]

    if not data:
        return Response({'error': 'No data found'}, status=404)

    serializer = SensorSerializers(data, many=True)
    return Response(serializer.data)
