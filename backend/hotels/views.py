from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model

from .models import Hotel
from .serializers import HotelSerializer


User = get_user_model()


class HotelViewSet(viewsets.ModelViewSet):
    serializer_class = HotelSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        """
        Retourne uniquement les hôtels créés par l'utilisateur connecté
        """
        return Hotel.objects.filter(
            owner=self.request.user
        ).order_by('created_at')


    def perform_create(self, serializer):
        """
        Lors de la création d'un hôtel,
        l'utilisateur connecté devient automatiquement le propriétaire.
        """
        serializer.save(owner=self.request.user)



class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        # On garde ta logique actuelle :
        # nombre réel de comptes dans la table User
        user_count = User.objects.count()


        # Nombre d'hôtels appartenant uniquement
        # à l'utilisateur connecté
        hotel_count = Hotel.objects.filter(
            owner=request.user
        ).count()


        data = {
            "formulaires": 125,
            "messages": 40,

            # On garde ta logique existante
            "utilisateurs": 600,
            "emails": user_count,

            # Maintenant dynamique par utilisateur
            "hotels": hotel_count,

            "entites": 2,
        }

        return Response(data)