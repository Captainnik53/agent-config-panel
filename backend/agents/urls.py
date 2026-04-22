from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AgentViewSet, AgentConfigViewSet
from .staging_views import StagingAgentListView, StagingAgentDetailView

router = DefaultRouter()
router.register(r'agents', AgentViewSet, basename='agent')
router.register(r'configs', AgentConfigViewSet, basename='agentconfig')

urlpatterns = [
    path('', include(router.urls)),
    path('staging/agents/', StagingAgentListView.as_view(), name='staging-agent-list'),
    path('staging/agents/<str:phone_number>/', StagingAgentDetailView.as_view(), name='staging-agent-detail'),
]
