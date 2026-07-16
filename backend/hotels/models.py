from django.db import models


class Hotel(models.Model):
    class Currency(models.TextChoices):
        XOF = 'XOF', 'Franc CFA'
        USD = 'USD', 'Dollar'
        EUR = 'EUR', 'Euro'

    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, blank=True)
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
