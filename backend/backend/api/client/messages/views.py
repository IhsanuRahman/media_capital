from django.shortcuts import render
from channels.consumer import AsyncConsumer


class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self,event):
        print('connected')
# Create your views here.
