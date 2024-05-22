from django.shortcuts import render
from django.http import JsonResponse
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Posts, UserModel

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search(request):
    search=request.query_params['search']
    posts=Posts.objects.filter(Q(tags__name__icontains=search)|Q(description__icontains=search))
    postData = []
    for post in list(posts):
            postData.append({'image': post.content.url, 'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
                             'description': post.description, 'id': post.id, 'tags': [tag.name for tag in post.tags.all()]})
    users=UserModel.objects.filter(Q(username__icontains=search)|Q(first_name__icontains=search)|Q(last_name__icontains=search)|Q(description__icontains=search))
    
    usersData=[]
    for user in list(users):
          usersData.append({
               'username': user.username, 'first_name': user.first_name,
                    'last_name': user.last_name,'profile':user.profile.url, 'id': user.id, 
          })
    return JsonResponse({'users':usersData,'posts':postData})