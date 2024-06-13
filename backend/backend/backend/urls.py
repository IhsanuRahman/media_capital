"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings
from admin_auth.urls import urlpatterns as admin_urls
from posts import views
urlpatterns = [
    path('4dmin',admin.site.urls),
    path('',include('client_auth.urls')),
    path('messages/',include('message.urls')),
    path('',include('posts.urls')),
    path('',include('user_profile.urls')),
    path('',include('notifications.urls')),
    path('search',views.search),
    path('search-suggestion',views.search_suggestions)
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) +admin_urls
