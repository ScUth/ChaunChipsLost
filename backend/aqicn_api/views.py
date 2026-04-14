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

@api_view(['GET'])
def latest_n_aqicn(request, n):
    try:
        n = int(n)
        # n = min(n, 10)
    except:
        return Response({'error': 'Invalid n'}, status=400)

    data = AqicnApi.objects.order_by('-ts')[:n]

    if not data:
        return Response({'error': 'No data found'}, status=404)

    serializer = Aqicn_ApiSerializers(data, many=True)
    return Response(serializer.data)