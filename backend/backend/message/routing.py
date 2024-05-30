from django.urls import path , include
from .consumers import ChatConsumer, ChatNotifier

# Here, "" is routing to the URL ChatConsumer which 
# will handle the chat functionality.
websocket_urlpatterns = [
    path("get-messages/<str:token>" , ChatNotifier.as_asgi()) , 
    path("chat/<str:token>/<str:receiver_id>" , ChatConsumer.as_asgi()) , 
] 