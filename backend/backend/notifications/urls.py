from django.urls import  path
from . import views
urlpatterns =[
    path('admin/notification/create',views.create_notification),
    path('notifications',views.get_notifications),
    path('admin/notifications',views.get_all_notifications),
    path('admin/notification/activate',views.activate_notifications),
]