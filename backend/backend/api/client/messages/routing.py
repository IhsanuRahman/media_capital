from django.urls import path , include
from .consumers import ChatConsumer

# Here, "" is routing to the URL ChatConsumer which 
# will handle the chat functionality.
websocket_urlpatterns = [
    path("<str:token>/<str:receiver_id>" , ChatConsumer.as_asgi()) , 
] 