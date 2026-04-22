from rest_framework import viewsets, permissions
from .models import Agent, AgentConfig
from .serializers import AgentSerializer, AgentConfigSerializer


class AgentViewSet(viewsets.ModelViewSet):
    serializer_class = AgentSerializer
    permission_classes = [permissions.AllowAny]  # tighten once auth is wired

    def get_queryset(self):
        qs = Agent.objects.select_related('config').all()
        env = self.request.query_params.get('environment')
        if env:
            qs = qs.filter(environment=env)
        return qs


class AgentConfigViewSet(viewsets.ModelViewSet):
    queryset = AgentConfig.objects.select_related('agent').all()
    serializer_class = AgentConfigSerializer
    permission_classes = [permissions.AllowAny]
