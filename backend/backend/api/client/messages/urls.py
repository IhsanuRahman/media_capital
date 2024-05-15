from django.urls import include, path
from . import views
urlpatterns =[
    path('users',views.get_users)
]