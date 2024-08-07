import datetime
import json
from channels.layers import get_channel_layer
from channels.generic.websocket import  AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import  AccessToken
from client_auth.models import UserModel as User
from .models import MessageModel, Rooms
from django.db.models import Q
import uuid


class ChatNotifier(AsyncWebsocketConsumer):
    async def connect(self):
        token = (self.scope['url_route']['kwargs']['token'])
        user = await self.get_user_object(token)
        self.roomGroupName = 'user_id'+str(user.id)
        print('id:', 'user_id'+str(user.id))
        await self.channel_layer.group_add(
            self.roomGroupName,
            self.channel_name
        )
        await self.accept()

    async def sendMessage(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def get_user_object(self, token):
        print(token)
        token = AccessToken(token=token)
        print(token)
        return User.objects.get(id=token.payload['user_id'])


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        token = (self.scope['url_route']['kwargs']['token'])
        receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        receiver = await self.get_user_by_id(receiver_id)
        sender = await self.get_user_object(token=token)
        block_status= await self.get_block_status(sender, receiver)
        is_blocker=await self.is_blocker(sender,receiver)
        print('block stauts',block_status)
        gname = await self.get_room(sender, receiver)

        self.roomGroupName = gname

        await self.channel_layer.group_add(
                self.roomGroupName,
                self.channel_name
        )
        if not block_status:
            messages = await self.get_messages(gname)
            await self.accept()
            await self.send(json.dumps({'text_data': {'messages': messages}}))
            if is_blocker:
                await self.send(json.dumps({'text_data':{'messages':[{"message": "you blocked the user ", 'username': 'server',
                         'sended_at': ''}]}}))
                await self.close()

        else:
            await self.accept()
            await self.send(json.dumps({'text_data':{'messages':[{"message": "can't chat with this user", 'username': 'server',
                         'sended_at': ''}]}}))
            await self.close()
    
    async def disconnect(self, close_code):
        
            
        await self.channel_layer.group_discard(
            self.roomGroupName,
            self.channel_layer
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        username = text_data_json["username"]
        is_blocked= text_data_json.get('is_blocked',False)
        print(self.roomGroupName,
              self.channel_name)
        user = await self.get_user_object(token=(self.scope['url_route']['kwargs']['token']))
        await self.channel_layer.group_send(
            self.roomGroupName, {
                "type": 'sendMessage',
                "message": message,
                "username": username,
                "is_blocked":is_blocked,
            })

    async def sendMessage(self, event):
        message = event["message"]
        username = event["username"]
        user_id = self.scope['url_route']['kwargs']['receiver_id']
        receiver = await self.get_user_by_id(user_id)

        token = self.scope['url_route']['kwargs']['token']
        user = await self.get_user_object(token)
        block_status= await self.get_block_status(user, receiver)
        if block_status:
            
            await self.send(json.dumps({"message": "can't chat with this user", 'username': 'server',
                         'sended_at': ''}))
            await self.close()
            return
        print(username, receiver.id)
        channel_layer = get_channel_layer()
        msgObj = await self.create_message(sender=user, message=message, room_name=self.roomGroupName, receiver=receiver)
        on=''
        now=datetime.datetime.now()
        if msgObj.sended_at.date() == now.date():
            on = 'today'
        elif message.sended_at.date() == now.date()-datetime.timedelta(days=1):
            on = 'yesterday'
        else:
            on = message.sended_at.date().strftime("%d/%m/%Y")
        await channel_layer.group_send(
            'user_id'+str(receiver.id),
            {
                "type": "sendMessage",
                        'profile': user.profile.url,
                        "username": user.username,
                        "id": user.id,
                        'lastMessage': message,
                        'time': on,
                 },
        )
        print('id:', 'user_id'+str(receiver.id))
        await self.send(text_data=json.dumps({"message": message, "username": username, 'to': 'ihsan'}))

    async def send_old_messages(self, messages):
        for message in messages:
            print(message.message, message.sender.username)
            await self.send(text_data=json.dumps({"message": message.message, 'username': message.sender.username}))

    @database_sync_to_async
    def get_user_by_id(self, id):
        user = User.objects.filter(id=id).first()
        if user is None:
            raise KeyError()
        return user
    
    @database_sync_to_async
    def get_block_status(self,sender,receiver)  :
        return receiver.blocked_users.filter(id=sender.id).exists()
    
    @database_sync_to_async
    def is_blocker(self,sender,receiver):
        return receiver.blocker.filter(id=sender.id).exists()
    @database_sync_to_async
    def get_user_block_list(self, user):
        
        return user.blocked_users.all()
    
    @database_sync_to_async
    def get_user_blockers(self, user):
        user = User.objects.filter(id=user.id).first()
        if user is None:
            raise KeyError()
        return user.blocker.all()

    @database_sync_to_async
    def get_user_object(self, token):
        token = AccessToken(token=token)
        return User.objects.get(id=token.payload['user_id'])

    @database_sync_to_async
    def create_message(self, sender, receiver, message, room_name):
        messageObj = MessageModel(
            sender=sender, receiver=receiver, message=message)
        room = Rooms.objects.filter(groupName=room_name).first()
        messageObj.save() 
        room.messages.add(messageObj)
        room.save()
        return messageObj

    @database_sync_to_async
    def get_room(sdataself, user1, user2):
        print(user1.id, user2.id)
        room = Rooms.objects.filter(Q(users__id=user1.id))
        room = room.filter(Q(users__id=user2.id)).first()
        if room:
            return room.groupName
        else:
            print('creating new')
            room = Rooms(groupName=str(uuid.uuid1()))
            room.save()
            room.users.add(user1)
            room.users.add(user2)
            room.save()
            return room.groupName

    @database_sync_to_async
    def get_messages(self, room_name):
        token = (self.scope['url_route']['kwargs']['token'])
        token = AccessToken(token=token)
        user_id=token.payload['user_id']
        messages = Rooms.objects.filter(groupName=room_name).first()
        datas = []
        print(messages.messages.all().order_by('sended_at').values())
        for msg in messages.messages.all().order_by('sended_at'):
            datas.append({"message": msg.message, 'username': msg.sender.username,
                         'sended_at': msg.sended_at.strftime('%Y-%m-%d %H:%M:%z')})
        messages.messages.filter(receiver__id=user_id).update(is_new=False)
        return datas
