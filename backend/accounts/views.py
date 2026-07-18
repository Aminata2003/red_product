# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class ForgotPasswordView(APIView):
    """
    Envoie un vrai e-mail (via Brevo) contenant un lien de réinitialisation,
    si un compte existe avec cet e-mail. Renvoie toujours le même message
    générique, pour ne pas révéler quels comptes existent.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"detail": "L'email est requis."}, status=status.HTTP_400_BAD_REQUEST)

        generic_response = Response(
            {"detail": "Si un compte existe avec cet email, des instructions ont été envoyées."},
            status=status.HTTP_200_OK
        )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # On renvoie quand même le message générique, sans envoyer de mail.
            return generic_response

        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uidb64}/{token}/"

        send_mail(
            subject="Réinitialisation de votre mot de passe — RED PRODUCT",
            message=(
                f"Bonjour,\n\n"
                f"Vous avez demandé la réinitialisation de votre mot de passe.\n"
                f"Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :\n\n"
                f"{reset_link}\n\n"
                f"Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.\n\n"
                f"L'équipe RED PRODUCT"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return generic_response


class ResetPasswordConfirmView(APIView):
    """
    Vérifie le lien (uid + token) reçu par e-mail et enregistre le nouveau
    mot de passe si tout est valide.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not uidb64 or not token or not new_password:
            return Response(
                {"detail": "uid, token et new_password sont requis."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {"detail": "Le mot de passe doit contenir au moins 8 caractères."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response(
                {"detail": "Lien de réinitialisation invalide."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"detail": "Ce lien a expiré ou est invalide. Refaites une demande."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Mot de passe réinitialisé avec succès."},
            status=status.HTTP_200_OK
        )