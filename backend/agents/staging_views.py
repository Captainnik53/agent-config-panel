from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from .ssh_client import read_agent_metadata, write_agent_metadata
from .agent_codec import json_to_api, api_to_json, list_entry


class StagingAgentListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            data = read_agent_metadata()
        except Exception as exc:
            return Response({'error': str(exc)}, status=502)
        agents = [list_entry(phone, raw) for phone, raw in data.items()]
        return Response(agents)


class StagingAgentDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, phone_number):
        try:
            data = read_agent_metadata()
        except Exception as exc:
            return Response({'error': str(exc)}, status=502)
        if phone_number not in data:
            return Response({'error': 'Agent not found'}, status=404)
        return Response(json_to_api(phone_number, data[phone_number]))

    def patch(self, request, phone_number):
        try:
            data = read_agent_metadata()
        except Exception as exc:
            return Response({'error': str(exc)}, status=502)
        if phone_number not in data:
            return Response({'error': 'Agent not found'}, status=404)

        updated = api_to_json(request.data, data[phone_number])
        data[phone_number] = updated

        try:
            write_agent_metadata(data)
        except Exception as exc:
            return Response({'error': f'Write failed: {exc}'}, status=502)

        return Response(json_to_api(phone_number, updated))
