from django.shortcuts import render
from .models import Rooms
from client_auth.models import UserModel
from channels.consumer import AsyncConsumer
from django.http import JsonResponse
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    block_list=UserModel.objects.get(id=request.user.id).blocked_users.all()
    blockers=UserModel.objects.get(id=request.user.id).blocker.all()
    data = []
    print(request.query_params)
    if request.query_params['search'] == '':
        users = UserModel.objects.exclude(
            id=request.user.id).values('id', 'username', 'profile')
        print(users, request.user)
        rooms = Rooms.objects.filter(users__id=request.user.id)
        for user in users:
            room = rooms.filter(users__id=user['id']).first()
            if rooms.filter(users__id=user['id']).exists():
                message = room.messages.all().order_by('sended_at').last()
                if message:
                    on = message.sended_at.strftime("%Y-%m-%dT%H:%M:%SZ")
                    print('on:',on)
                    data.append({
                        'profile': '/media/'+user['profile'],
                        "username": user['username'],
                        "id": user['id'],
                        'lastMessage': message.message,
                        'time': on,
                        'is_blocked':block_list.filter(id=user['id']).exists()
                    })
    else:
        search = request.query_params['search']
        users = UserModel.objects.filter(Q(username__icontains=search) | Q(
            first_name__icontains=search) | Q(last_name__icontains=search)).exclude(id=request.user.id).exclude(id__in=blockers.values('id'))
        for user in users:
            data.append({
                        'profile': user.profile.url,
                        'username': user.username,
                        'id': user.id,
                        'message': '',
                        'time': '',
                        'is_blocked':block_list.filter(id=user.id).exists()
                        })
    return JsonResponse({'users': data})



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def block_user(request):
    user=UserModel.objects.get(id=request.user.id)
    suspect_id=request.data.get('user_id',None)
    if suspect_id:
        try:
            suspect=UserModel.objects.get(id=suspect_id)
        except:
            return JsonResponse({'message':'suspect not found'},status=404)
        if user.blocked_users.filter(id=suspect_id).exists():
            user.blocked_users.remove(suspect)
        else:
            channel_layer=get_channel_layer()
            room = Rooms.objects.filter(Q(users__id=user.id))
            room = room.filter(Q(users__id=suspect_id)).first()
            try:
                print(room.groupName)
                async_to_sync(channel_layer.group_send)(room.groupName, {
                            "type": "sendMessage",
                            "message": "can't with this user", 'username': 'server',
                            'sended_at': '',"is_blocked":True
                                    
                            })
            except:
                print('errror on sendin ')
            user.blocked_users.add(suspect)
        return JsonResponse({'message':'block user success'})
    return JsonResponse({'message':'suspect id is needed'},status=400)