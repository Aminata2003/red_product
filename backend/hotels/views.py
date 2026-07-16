from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from .models import Hotel
from .serializers import HotelSerializer

User = get_user_model()


class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all().order_by('-created_at')
    serializer_class = HotelSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = {
            "formulaires": 125,
            "messages": 40,
            "utilisateurs": User.objects.count(),
            "emails": 25,
            "hotels": Hotel.objects.count(),
            "entites": 2,
        }
        return Response(data)