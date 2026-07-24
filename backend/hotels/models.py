from django.db import models
from django.conf import settings
from django.core.validators import RegexValidator


class Hotel(models.Model):
    class Currency(models.TextChoices):
        XOF = 'XOF', 'Franc CFA'
        USD = 'USD', 'Dollar'
        EUR = 'EUR', 'Euro'

    phone_validator = RegexValidator(
        regex=r'^[\d+\s]*$',
        message="Le numéro de téléphone ne doit contenir que des chiffres, espaces ou un signe +."
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="hotels",
        null=True,
        blank=True
    )

    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True, validators=[phone_validator])
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=Currency.choices, default=Currency.XOF)
    image = models.ImageField(upload_to='hotels/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'address'], name='unique_hotel_name_address')
        ]

    def __str__(self):
        return self.name


class HotelActivityLog(models.Model):
    """
    Journal d'activité sur les hôtels (modification/suppression), utilisé
    pour alimenter les notifications des AUTRES admins. On ne stocke qu'un
    message texte (nom de l'hôtel, action, auteur) : l'hôtel lui-même reste
    privé à son propriétaire, seul le fait qu'une action a eu lieu est
    partagé.
    """
    class Action(models.TextChoices):
        CREATED = 'created', 'créé'
        UPDATED = 'updated', 'modifié'
        DELETED = 'deleted', 'supprimé'

    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='hotel_activities',
    )
    # snapshot au moment de l'action : reste lisible même si le compte admin
    # ou l'hôtel est supprimé par la suite
    actor_username = models.CharField(max_length=150)
    hotel_name = models.CharField(max_length=255)
    action = models.CharField(max_length=10, choices=Action.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.actor_username} a {self.action} {self.hotel_name}"