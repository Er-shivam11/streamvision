# VideoStreaming/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, MediaFileViewSet

# Set up router for media-related actions
router = DefaultRouter()
router.register(r'media', MediaFileViewSet, basename='media')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),  # Login route
    path('', include(router.urls)),  # Media API endpoints
]
