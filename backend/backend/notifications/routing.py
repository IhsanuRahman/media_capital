from django.urls import path , include
from .consumers import Notifier

# Here, "" is routing to the URL ChatConsumer which 
# will handle the chat functionality.
websocket_urlpatterns = [
    path("get-notifications/<str:token>" , Notifier.as_asgi()) , 
] 