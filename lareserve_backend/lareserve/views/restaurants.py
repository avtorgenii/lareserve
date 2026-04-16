from django.http import JsonResponse
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


@extend_schema()
@api_view(['GET'])
@permission_classes([AllowAny])
def test(request):
    return JsonResponse({'test': 'test'})

