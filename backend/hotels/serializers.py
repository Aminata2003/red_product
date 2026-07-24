from rest_framework import serializers
from .models import Hotel, HotelActivityLog


class HotelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hotel

        fields = [
            'id',
            'name',
            'address',
            'email',
            'phone',
            'price_per_night',
            'currency',
            'image',
            'created_at',
            'updated_at',
            'owner',
        ]

        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'owner',
        ]

        validators = []  # désactive le UniqueTogetherValidator auto-généré par DRF

    def validate(self, data):

        name = data.get(
            'name',
            getattr(self.instance, 'name', None)
        )

        address = data.get(
            'address',
            getattr(self.instance, 'address', None)
        )

        queryset = Hotel.objects.filter(
            name=name,
            address=address
        )

        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():
            raise serializers.ValidationError(
                "Un hôtel avec le même nom et la même adresse existe déjà."
            )

        return data


class HotelActivityLogSerializer(serializers.ModelSerializer):
    message = serializers.SerializerMethodField()

    class Meta:
        model = HotelActivityLog
        fields = ['id', 'message', 'created_at']

    def get_message(self, obj):
        verbs = {'created': 'a créé', 'updated': 'a modifié', 'deleted': 'a supprimé'}
        verb = verbs.get(obj.action, obj.action)
        return f"{obj.actor_username} {verb} l'hôtel « {obj.hotel_name} »"