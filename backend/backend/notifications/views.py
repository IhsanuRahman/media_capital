from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from admin_auth.utils import admin_only
from .serializers import NotificationSerilizer
from .models import Notifications
from django.db.models import Q

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_only
def create_notification(request):
    title=request.data.get('title',None)
    description=request.data.get('description',None)
    if title and description:
        notif=Notifications(title=title,description=description)
        notif.save()
        return JsonResponse({'message':'notification is created'})
    return JsonResponse({'message':'title or description is required'},status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_only
def get_all_notifications(request):

    notifications=NotificationSerilizer(Notifications.objects.all(),many=True).data

    return JsonResponse({'notifications':notifications})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@admin_only
def activate_notifications(request):
    id=request.data.get('id',None)
    if id:
        notification=Notifications.objects.get(id=id)
        notification.is_active= not notification.is_active
        notification.save()
        return JsonResponse({'message':'success'})
    return JsonResponse({'message':'id is required'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications=NotificationSerilizer(Notifications.objects.filter(is_active=True).filter(Q(user=None)|Q(user__id=request.user.id))[:8],many=True).data
    return JsonResponse({'notifications':notifications})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_only
def edit_notifications(request):
    id=request.data.get('id',None)
    title=request.data.get('title',None)
    description=request.data.get('description',None)
    if id and title and description: 
        notification=Notifications.objects.get(id=id)
        notification.title= title
        notification.description= description
        notification.save()
        return JsonResponse({'message':'success'})
    return JsonResponse({'message':'id is required'})