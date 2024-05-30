import datetime
from django.shortcuts import render
from .models import Rooms
from client_auth.models import UserModel
from channels.consumer import AsyncConsumer
from django.http import JsonResponse
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q


# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
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
                    now = datetime.datetime.now()
                    on = ''
                    if message.sended_at.date() == now.date():
                        on = 'today'
                    elif message.sended_at.date() == now.date()-datetime.timedelta(days=1):
                        on = 'yesterday'
                    else:
                        on = message.sended_at.date().strftime("%d/%m/%Y")

                    data.append({
                        'profile': '/media/'+user['profile'],
                        "username": user['username'],
                        "id": user['id'],
                        'lastMessage': message.message,
                        'time': on,
                    })
    else:
        search = request.query_params['search']
        users = UserModel.objects.filter(Q(username__icontains=search) | Q(
            first_name__icontains=search) | Q(last_name__icontains=search))
        for user in users:
            data.append({
                        'profile': user.profile.url,
                        'username': user.username,
                        'id': user.id,
                        'message': '',
                        'time': ''
                        })
    return JsonResponse({'users': data})
