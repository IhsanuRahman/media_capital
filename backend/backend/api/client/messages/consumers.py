import json
from channels.consumer import AsyncConsumer
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import  RefreshToken,AccessToken
from asgiref.sync import async_to_sync
from api.models import UserModel as User,Message,Rooms
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
        return User.objects.filter(id=id).first()   
    @database_sync_to_async
    def get_user_object(self, token): 
       token=AccessToken(token=token)
       return User.objects.get(id=token.payload['user_id'])  
    @database_sync_to_async
    def create_message(self,sender,receiver,message,room_name):
        messageObj=Message(sender=sender,receiver=receiver,message=message)
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
    
"""
<QuerySet [
    {'id': 13928, 'message': 'hai', 'sender_id': 20, 'receiver_id': 14, 'sended_at': datetime.datetime(2024, 5, 16, 3, 47, 44, 962962, tzinfo=datetime.timezone.utc)},
      {'id': 13929, 'message': 'hai', 'sender_id': 14, 'receiver_id': 20, 'sended_at': datetime.datetime(2024, 5, 16, 3, 47, 44, 988077, tzinfo=datetime.timezone.utc)},
        {'id': 13930, 'message': 'hai', 'sender_id': 20, 'receiver_id': 14, 'sended_at': datetime.datetime(2024, 5, 16, 3, 47, 54, 567961, tzinfo=datetime.timezone.utc)},
        {'id': 13931, 'message': 'hai', 'sender_id': 14, 'receiver_id': 20, 'sended_at': datetime.datetime(2024, 5, 16, 3, 47, 54, 588604, tzinfo=datetime.timezone.utc)}, 
        {'id': 13932, 'message': 'hello', 'sender_id': 20, 'receiver_id': 14, 'sended_at': datetime.datetime(2024, 5, 16, 3, 48, 1, 249184, tzinfo=datetime.timezone.utc)}, 
        {'id': 13933, 'message': 'hello', 'sender_id': 14, 'receiver_id': 20, 'sended_at': datetime.datetime(2024, 5, 16, 3, 48, 1, 270038, tzinfo=datetime.timezone.utc)}, 
        {'id': 13934, 'message': 'message hai', 'sender_id': 20, 'receiver_id': 14, 'sended_at': datetime.datetime(2024, 5, 16, 3, 48, 21, 757812, tzinfo=datetime.timezone.utc)}, 
        {'id': 13935, 'message': 'message hai', 'sender_id': 14, 'receiver_id': 20, 'sended_at': datetime.datetime(2024, 5, 16, 3, 48, 21, 784961, tzinfo=datetime.timezone.utc)}, 
        {'id': 13936, 'message': 'hello', 'sender_id': 20, 'receiver_id': 14, 'sended_at': datetime.datetime(2024, 5, 16, 3, 48, 53, 762159, tzinfo=datetime.timezone.utc)}, 
        {'id': 13937, 'message': 'hello', 'sender_id': 14, 'receiver_id': 20, 'sended_at': datetime.datetime(2024, 5, 16, 3, 48, 53, 785553, tzinfo=datetime.timezone.utc)}, 
        {'id': 13938, 'message': 'hello', 'sender_id': 20, 'receiver_id': 14, 'sended_at': datetime.datetime(2024, 5, 16, 3, 48, 54, 801964, tzinfo=datetime.timezone.utc)}, 
        {'id': 13939, 'message': 'hello', 'sender_id': 14, 'receiver_id': 20, 'sended_at': datetime.datetime(2024, 5, 16, 3, 48, 54, 819858, tzinfo=datetime.timezone.utc)}, 
        {'id': 13940, 'message': 'hello', 'sender_id': 20, 'receiver_id': 14, 'sended_at': datetime.datetime(2024, 5, 16, 3, 48, 55, 454750, tzinfo=datetime.timezone.utc)}, 
        {'id': 13941, 'message': 'hello', 'sender_id': 14, 'receiver_id': 20, 'sended_at': datetime.datetime(2024, 5, 16, 3, 48, 55, 473977, tzinfo=datetime.timezone.utc)}, 
        {'id': 13942, 'message': 'fd', 'sender_id': 20, 'receiver_id': 14, 'sended_at': datetime.datetime(2024, 5, 16, 4, 18, 54, 636105, tzinfo=datetime.timezone.utc)}, 
        {'id': 13943, 'message': 'fd', 'sender_id': 14, 'receiver_id': 20, 'sended_at': datetime.datetime(2024, 5, 16, 4, 18, 54, 660898, tzinfo=datetime.timezone.utc)}, 
        {'id': 13944, 'message': 'fd', 'sender_id': 20, 'receiver_id': 14, 'sended_at': datetime.datetime(2024, 5, 16, 4, 18, 54, 877789, tzinfo=datetime.timezone.utc)}, 
        {'id': 13945, 'message': 'fd', 'sender_id': 14, 'receiver_id': 20, 'sended_at': datetime.datetime(2024, 5, 16, 4, 18, 54, 901255, tzinfo=datetime.timezone.utc)}, 
        {'id': 13946, 'message': 'fd', 'sender_id': 20, 'receiver_id': 14, 'sended_at': datetime.datetime(2024, 5, 16, 4, 18, 55, 124949, tzinfo=datetime.timezone.utc)}, 
        {'id': 13947, 'message': 'fd', 'sender_id': 14, 'receiver_id': 20, 'sended_at': datetime.datetime(2024, 5, 16, 4, 18, 55, 150936, tzinfo=datetime.timezone.utc)}]>
"""