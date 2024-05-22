from django.shortcuts import render
from django.http import JsonResponse
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from api.client.auth.serilizers import UserRegisterSerilizer
from api.models import Posts, Tags, UserModel
from api.client.user_profile.serializers import UserUpdateSerilizer


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    user = request.user
    user = UserModel.objects.get(id=user.id)
    if user:
        user = UserUpdateSerilizer(instance=user, data=request.data)
        if user.is_valid():
            user.save()
            user = UserModel.objects.get(id=request.user.id)
            print(user)
            interests = json.loads(request.data.get('intresets', ''))
            user.intresets.all().delete()
            for intrst in interests:
                tag, created = Tags.objects.get_or_create(name=intrst)
                print(tag)
                tag.save()
                user.intresets.add(tag)

            user.save()
            return JsonResponse({'message': 'user update success'}, status=200)
        else:
            return JsonResponse({'message': user.errors}, status=400)
    else:
        return JsonResponse({'message': 'user not found'}, status=401)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.user.id and 'old_password' in request.data and 'new_password' in request.data and 'conform_password' in request.data:
        user = UserModel.objects.get(id=request.user.id)
        if request.data['new_password'] == request.data['conform_password']:
            new_password = request.data['new_password']
            old_password = request.data['old_password']
            if user.check_password(old_password):
                if new_password == old_password:
                    return JsonResponse({'message': 'old and new password are same'}, status=400)
                user.set_password(new_password)
                user.save()
                return JsonResponse({'message': 'change password success'}, status=200)

        return JsonResponse({'message': 'passwords are not match'}, status=401)
    return JsonResponse({'message': 'not found'}, status=401)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_userdata(request):
    id = request.query_params['id']
    if id:
      user = UserModel.objects.get(id=id)
      posts = Posts.objects.filter(user__id=id)
      postData = []
      for post in list(posts):
            postData.append({'image': post.content.url, 'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
                             'description': post.description, 'id': post.id, 'tags': [tag.name for tag in post.tags.all()]})
      supportings=user.supportings.count()
      supporters=user.supporters.count()
      userData = {'username': user.username, 'first_name': user.first_name,
                    'last_name': user.last_name, 'id': user.id, 'banner':  user.banner.url if user.banner else '',
                    'profile':user.profile.url,"supportings":supportings,'supporters':supporters,'description':user.description,
                    'is_supporting':UserModel.objects.get(id=request.user.id) in user.supporters.all()
                    }
      return JsonResponse({'userData':userData,'posts':postData})
    return JsonResponse({'message':'not found'},status=401)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def support(request):
    id=request.data.get("id")
    if id:
        user=UserModel.objects.get(id=id)
        supporter=UserModel.objects.get(id=request.user.id)
        if user==supporter:
            return JsonResponse({'message':'self support not allowed'},status=401)
        if user in supporter.supportings.all():
            supporter.supportings.remove(user)
            print('unsuport',user,supporter)
            return JsonResponse({'message':'unsupported'},status=201)
        print('suport',user,supporter.supportings.all())
        supporter.supportings.add(user)
        return JsonResponse({'message':'supported'},status=201)
    return JsonResponse({'message':'not found'},status=401)
