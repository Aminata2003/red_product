from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from .models import Hotel
from .serializers import HotelSerializer

User = get_user_model()


class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all().order_by('created_at')
    serializer_class = HotelSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # "emails" reprend désormais le compte réel des comptes créés (table User),
        # au lieu de la valeur 25 codée en dur.
        # "utilisateurs" reste renvoyé pour info mais le frontend l'ignore pour
        # l'instant et affiche 600 (valeur fixe de la maquette).
        user_count = User.objects.count()

        data = {
            "formulaires": 125,
            "messages": 40,
            "utilisateurs": user_count,
            "emails": user_count,
            "hotels": Hotel.objects.count(),
            "entites": 2,
        }
        return Response(data)