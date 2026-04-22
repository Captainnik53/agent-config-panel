from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AgentViewSet, AgentConfigViewSet

router = DefaultRouter()
router.register(r'agents', AgentViewSet, basename='agent')
router.register(r'configs', AgentConfigViewSet, basename='agentconfig')

urlpatterns = [
    path('', include(router.urls)),
]
