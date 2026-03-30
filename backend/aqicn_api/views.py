from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AqicnApi
from .serializer import Aqicn_ApiSerializers

@api_view(['GET'])
def latest_aqicn(request):
    data = AqicnApi.objects.order_by('-ts').first()
    if data is None:
        return Response({'error': 'No data found'}, status=404)
    serializer = Aqicn_ApiSerializers(data)
    return Response(serializer.data)