# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
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
    Version simplifiée (mock) pour le délai d'une semaine :
    ne vérifie même pas si l'email existe (pour ne pas révéler
    quels comptes existent), renvoie toujours un message générique.
    L'envoi réel d'email (SMTP) pourra être ajouté plus tard si le temps le permet.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"detail": "L'email est requis."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"detail": "Si un compte existe avec cet email, des instructions ont été envoyées."},
            status=status.HTTP_200_OK
        )
