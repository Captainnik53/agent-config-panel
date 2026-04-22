import urllib.request
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import JsonResponse


def health(request):
    return JsonResponse({'status': 'ok'})


def outbound_ip(request):
    try:
        with urllib.request.urlopen('https://api.ipify.org?format=json', timeout=5) as r:
            return JsonResponse({'outbound_ip': __import__('json').loads(r.read())['ip']})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


urlpatterns = [
    path('health/', health),
    path('api/outbound-ip/', outbound_ip),
    path('admin/', admin.site.urls),
    path('api/', include('agents.urls')),
    # Catch-all: serve the React SPA for any non-API route
    re_path(r'^(?!api/|admin/|health/).*$', TemplateView.as_view(template_name='index.html')),
]
