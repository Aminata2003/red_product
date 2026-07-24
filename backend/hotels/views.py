from django.utils.dateparse import parse_datetime
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import Hotel, HotelActivityLog
from .serializers import HotelSerializer, HotelActivityLogSerializer

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

    def perform_update(self, serializer):
        instance = serializer.save()
        HotelActivityLog.objects.create(
            actor=self.request.user,
            actor_username=self.request.user.username,
            hotel_name=instance.name,
            action='updated',
        )

    def perform_destroy(self, instance):
        # on capture le nom avant suppression, sinon il n'existe plus après
        HotelActivityLog.objects.create(
            actor=self.request.user,
            actor_username=self.request.user.username,
            hotel_name=instance.name,
            action='deleted',
        )
        instance.delete()

    @action(detail=False, methods=['get'], url_path='activity')
    def activity(self, request):
        """
        GET /api/hotels/activity/?since=<ISO datetime>
        Renvoie l'activité des AUTRES admins (pas la sienne) sur les hôtels
        (modifications/suppressions), sans exposer les hôtels eux-mêmes.
        """
        since_param = request.query_params.get('since')
        since_dt = parse_datetime(since_param) if since_param else None

        qs = HotelActivityLog.objects.exclude(actor=request.user)

        count_new = qs.filter(created_at__gt=since_dt).count() if since_dt else qs.count()
        recent = qs.order_by('-created_at')[:10]

        return Response({
            'count_new': count_new,
            'results': HotelActivityLogSerializer(recent, many=True).data,
        })


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # formulaires / messages / entites : fonctionnalités pas encore
        # développées côté backend -> 0 plutôt qu'une fausse valeur en dur.
        # utilisateurs : dynamique (nombre réel de comptes créés).
        # emails : reste statique à 25 (décision du coach, comme au début).
        # hotels : dynamique, scopé à l'admin connecté (ses propres hôtels).
        data = {
            "formulaires": 0,
            "messages": 0,
            "utilisateurs": User.objects.count(),
            "emails": 0,
            "hotels": Hotel.objects.filter(owner=request.user).count(),
            "entites": 0,
        }
        return Response(data)