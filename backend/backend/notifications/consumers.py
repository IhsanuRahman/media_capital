import json
from channels.generic.websocket import  AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import  AccessToken
from client_auth.models import UserModel as User
from .models import Notifications
from .serializers import NotificationSerilizer
from django.db.models import Q


class Notifier(AsyncWebsocketConsumer):
    async def connect(self):
        token = (self.scope['url_route']['kwargs']['token'])
        user = await self.get_user_object(token)
        self.roomGroupName = 'notification_'+str(user.id)
        await self.channel_layer.group_add(
            self.roomGroupName,
            self.channel_name
        )
        notifyData= await self.get_notifications(user)
        await self.accept()
        print('notify',notifyData)
        await self.send(json.dumps({'text_data': notifyData}))
        

    async def send_notification(self, event):
        print('s no',{j:event['data'][j] for j in event['data']})
        await self.send(text_data=json.dumps({j:event['data'][j] for j in event['data']}))

    @database_sync_to_async 
    def get_user_object(self, token):
        print(token)
        token = AccessToken(token=token)
        print(token)
        return User.objects.get(id=token.payload['user_id'])
    
    @database_sync_to_async
    def get_notifications(self ,user):
        notificationObj=Notifications.objects.filter(Q(user=None)|Q(user=user)).filter(is_active=True)
        return NotificationSerilizer(notificationObj,many=True).data  
