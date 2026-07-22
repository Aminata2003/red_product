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
        # Chaque admin ne voit (et ne peut modifier/supprimer) que ses propres
        # hôtels. Comme get_object() (utilisé par retrieve/update/destroy)
        # s'appuie sur get_queryset(), un admin qui tente d'accéder à l'hôtel
        # d'un autre reçoit naturellement une 404, sans logique supplémentaire.
        return Hotel.objects.filter(owner=self.request.user).order_by('created_at')

    def perform_create(self, serializer):
        # Assigne automatiquement le propriétaire à la création : impossible
        # pour le client de le falsifier puisque 'owner' est read_only côté
        # serializer et fixé ici côté serveur.
        serializer.save(owner=self.request.user)


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Suite au retour du coach : "utilisateurs" doit être dynamique (nombre
        # réel de comptes créés), "emails" reste une valeur statique (25),
        # comme au tout début du projet.
        # "hotels" est scopé à l'admin connecté (ses propres hôtels).
        data = {
            "formulaires": 125,
            "messages": 40,
            "utilisateurs": User.objects.count(),
            "emails": 25,
            "hotels": Hotel.objects.filter(owner=request.user).count(),
            "entites": 2,
        }
        return Response(data)