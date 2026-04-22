from rest_framework import serializers
from .models import Agent, AgentConfig


class AgentConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentConfig
        exclude = ['agent']


class AgentSerializer(serializers.ModelSerializer):
    config = AgentConfigSerializer(read_only=True)

    class Meta:
        model = Agent
        fields = '__all__'
