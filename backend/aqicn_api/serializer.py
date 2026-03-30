from rest_framework import serializers
from .models import AqicnApi

class Aqicn_ApiSerializers(serializers.ModelSerializer):
    class Meta:
        model = AqicnApi
        fields = "__all__"