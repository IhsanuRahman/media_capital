from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import  RefreshToken,AccessToken
from api.client.auth.serilizers import UserRegisterSerilizer, UserSerializer
def login(request):
    return JsonResponse({
        'data':'hai'
    })

@api_view(['POST'])
def signup(request):
    print(request.data)
    user=UserRegisterSerilizer(data=request.data)
    if user.is_valid():
        user.save()
        return JsonResponse({
            'message':'user is created'
        },status=200)
    else:
        return JsonResponse(user.errors,status=403)
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_user(request):
    
    user = request.user
    user = UserSerializer(user)
    data=user.data
    # if UserImage.objects.filter(creator=request.user).exists():
    #     imageUrl=UserImage.objects.filter(creator=request.user).first().image.url
    #     data['image']='http://127.0.0.1:8000'+imageUrl
    # data['is_admin']=request.user.is_superuser
    return JsonResponse(data, status=200)
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def logout(request):
        refresh_token = request.data['refresh_token']
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            print(request.data)
        return JsonResponse({"message":"Logout Successful"}, status=200)