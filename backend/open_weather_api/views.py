from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import OpenWeatherApi
from .serializer import Open_Weather_ApiSerializers

@api_view(['GET'])
def latest_weather(request):
    data = OpenWeatherApi.objects.order_by('-ts').first()
    if data is None:
        return Response({'error': 'No data found'}, status=404)
    serializer = Open_Weather_ApiSerializers(data)
    return Response(serializer.data)