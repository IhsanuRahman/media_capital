from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from client_auth.models import UserModel
from rest_framework_simplejwt.tokens import  RefreshToken, AccessToken
from rest_framework.exceptions import AuthenticationFailed

@api_view(['GET','POST'])
def admin_login_view( request):
    print(request.data)
    username = request.data.get("username")
    password = request.data.get("password")

    try:
        user = UserModel.objects.get(username=username,is_staff=True)
    except UserModel.DoesNotExist:
        raise AuthenticationFailed("Account does  not exist")
    if user is None or  not user.is_superuser:
        raise AuthenticationFailed("User does not exist")
    if not user.check_password(password):
        raise AuthenticationFailed("Incorrect Password")
    access_token = str(AccessToken.for_user(user))
    refresh_token = str(RefreshToken.for_user(user))
    return JsonResponse({
        "access": access_token,
        "refresh": refresh_token
    })