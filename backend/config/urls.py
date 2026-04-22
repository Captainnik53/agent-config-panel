import urllib.request
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import JsonResponse


def health(request):
    return JsonResponse({'status': 'ok', 'v': 2})


def outbound_ip(request):
    import socket, json as _json
    result = {}
    try:
        with urllib.request.urlopen('https://api.ipify.org?format=json', timeout=5) as r:
            result['outbound_ip'] = _json.loads(r.read())['ip']
    except Exception as e:
        result['outbound_ip_error'] = str(e)

    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(6)
        s.connect(('182.76.167.99', 22))
        banner = s.recv(256).decode('utf-8', errors='replace').strip()
        s.close()
        result['ssh_test'] = f'connected — {banner}'
    except Exception as e:
        result['ssh_test'] = f'{type(e).__name__}: {e}'

    return JsonResponse(result)


urlpatterns = [
    path('health/', health),
    path('api/outbound-ip/', outbound_ip),
    path('admin/', admin.site.urls),
    path('api/', include('agents.urls')),
    # Catch-all: serve the React SPA for any non-API route
    re_path(r'^(?!api/|admin/|health/).*$', TemplateView.as_view(template_name='index.html')),
]
