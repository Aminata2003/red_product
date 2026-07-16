from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import HotelViewSet, DashboardStatsView

router = DefaultRouter()
router.register(r'hotels', HotelViewSet, basename='hotel')

urlpatterns = router.urls + [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]