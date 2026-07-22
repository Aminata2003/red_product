from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    ForgotPasswordView,
    ResetPasswordConfirmView,
    MeView,
    RecentRegistrationsView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordConfirmView.as_view(), name='reset_password_confirm'),
    path('me/', MeView.as_view(), name='me'),
    path('notifications/recent-registrations/', RecentRegistrationsView.as_view(), name='recent_registrations'),
]