from rest_framework import serializers
from .models import OpenWeatherApi

class Open_Weather_ApiSerializers(serializers.ModelSerializer):
    class Meta:
        model = OpenWeatherApi
        fields = "__all__"