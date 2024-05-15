from django.shortcuts import render
from api.models import UserModel
from channels.consumer import AsyncConsumer
from django.http import JsonResponse
import json
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self,event):
        print('connected')
    
# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    users=UserModel.objects.exclude(id=request.user.id).values('id','username')
    print(users,request.user)
    data = []
    for user in users:
        data.append({
            "username": user['username'],
            "id": user['id']
        })
    return JsonResponse({'users':data})