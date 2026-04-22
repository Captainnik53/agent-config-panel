from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import JsonResponse


def health(request):
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('health/', health),
    path('admin/', admin.site.urls),
    path('api/', include('agents.urls')),
    # Catch-all: serve the React SPA for any non-API route
    re_path(r'^(?!api/|admin/|health/).*$', TemplateView.as_view(template_name='index.html')),
]
