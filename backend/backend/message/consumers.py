import json
from channels.consumer import AsyncConsumer
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import  RefreshToken,AccessToken
from asgiref.sync import async_to_sync
from client_auth.models import UserModel as User
from .models import MessageModel,Rooms
from django.db.models import Q
import uuid

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        
        token=(self.scope['url_route']['kwargs']['token'])
        receiver_id=self.scope['url_route']['kwargs']['receiver_id']
        receiver= await self.get_user_by_id(receiver_id)
        sender=await self.get_user_object(token=token)
        gname=await self.get_room(sender,receiver)
        self.roomGroupName = gname
        
        await self.channel_layer.group_add(
            self.roomGroupName,
            self.channel_name
        )
       
        messages = await self.get_messages(gname)
        await self.accept()
        await self.send(json.dumps({'text_data':{'messages':messages}}))


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.roomGroupName,
            self.channel_layer
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        username = text_data_json["username"]
        print(self.roomGroupName,
            self.channel_name)
        user= await self.get_user_object(token=(self.scope['url_route']['kwargs']['token']))
        await self.channel_layer.group_send(
                self.roomGroupName, {
                    "type": "sendMessage",
                    "message": message,
                    "username": username,
                })
        
        

    async def sendMessage(self, event):
        message = event["message"]
        username = event["username"]
        user_id = self.scope['url_route']['kwargs']['receiver_id']
        receiver= await self.get_user_by_id(user_id)
        token=self.scope['url_route']['kwargs']['token']
        user = await self.get_user_object(token)
        print(username,message)
        await self.create_message(sender=user,message=message,room_name=self.roomGroupName,receiver=receiver)
        await self.send(text_data=json.dumps({"message": message, "username":username,'to':'ihsan'}))

    async def send_old_messages(self,messages):
        for message in messages:
            print(message.message,message.sender.username)
            await self.send(text_data=json.dumps({"message": message.message,'username':message.sender.username}))
        

    @database_sync_to_async
    def get_user_by_id(self,id):
        user=User.objects.filter(id=id).first()
        if user is None:
            raise KeyError()  
        return  user
    @database_sync_to_async
    def get_user_object(self, token): 
       token=AccessToken(token=token)
       return User.objects.get(id=token.payload['user_id'])  
    @database_sync_to_async
    def create_message(self,sender,receiver,message,room_name):
        messageObj=MessageModel(sender=sender,receiver=receiver,message=message)
        room=Rooms.objects.get(groupName=room_name)
        messageObj.save()
        room.messages.add(messageObj)
        room.save()
        return messageObj
    @database_sync_to_async
    def get_room(sdataself,user1,user2):
        print(user1.id,user2.id)
        room=Rooms.objects.filter(Q(users__id=user1.id))
        room=room.filter(Q(users__id=user2.id)).first()
        if room:
            return room.groupName
        else:
            print('creating new')
            room=Rooms(groupName=str(uuid.uuid1()))
            room.save()
            room.users.add(user1)
            room.users.add(user2)
            room.save()
            return room.groupName
    
    @database_sync_to_async
    def get_messages(self,room_name):
        messages=Rooms.objects.filter(groupName=room_name).first()
        datas=[]
        print(messages.messages.all().order_by('sended_at').values())
        for msg in messages.messages.all().order_by('sended_at'):
            datas.append({"message": msg.message,'username':msg.sender.username})
        return datas
    
