import datetime
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from api.client.auth.serilizers import UserRegisterSerilizer, UserSerializer
from api.client.auth.utils import otp_generator, otp_resender
from api.models import OTP, UserModel


def login(request):
    return JsonResponse({
        'data': 'hai'
    })


@api_view(['POST'])
def signup(request):
    print(request.data)
    user = UserRegisterSerilizer(data=request.data)
    if user.is_valid():
        user = user.save()
        if user:
            id = otp_generator(request, user)
            
            return JsonResponse({
                'message': 'user is created',
                'token': id
            }, status=200)
    else:
        return JsonResponse(user.errors, status=403)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    user = UserSerializer(user)
    data = user.data
    # if UserImage.objects.filter(creator=request.user).exists():
    #     imageUrl=UserImage.objects.filter(creator=request.user).first().image.url
    #     data['image']='http://127.0.0.1:8000'+imageUrl
    # data['is_admin']=request.user.is_superuser
    return JsonResponse(data, status=200)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    refresh_token = request.data['refresh_token']
    if refresh_token:
        token = RefreshToken(refresh_token)
        token.blacklist()
        print(request.data)
    return JsonResponse({"message": "Logout Successful"}, status=200)


@api_view(['GET', 'POST'])
def verify_otp(request):
    if request.data['otp'] and request.data['token']:
        otpObj = OTP.objects.filter(
            otp=request.data['otp'], id=request.data['token'])
        if otpObj.exists():
            otpObj = otpObj.first()
            print(datetime.datetime.now(), otpObj.otp_datetime)
            if datetime.datetime.now()-otpObj.otp_datetime.replace(tzinfo=None) > datetime.timedelta(minutes=3):
                otpObj.temp_user.delete()
                otpObj.delete()
                return JsonResponse({"message": "OTP verification time out"}, status=401)
            else:
                    temp_user = otpObj.temp_user
                    user=UserModel(
                        username=temp_user.username,
                        first_name=temp_user.first_name,
                        last_name=temp_user.last_name,
                        email=temp_user.email,
                        dob=temp_user.dob
                    )
                    user.set_password(temp_user.password)
                    user.save()
                    otpObj.temp_user.delete()
                    otpObj.delete()
                    return JsonResponse({'message': 'OTP verification Success'}, status=200)
        else:
            return JsonResponse({'message': 'OTP not valid'}, status=401)
    else:
        return JsonResponse({'message': 'OTP verification Failed'}, status=401)


@api_view(['GET', 'POST'])
def resend_otp(request):
    if request.data['token']:
        otpObj = OTP.objects.filter(
             id=request.data['token'])
        if otpObj.exists(): 
            otpObj = otpObj.first()
            print(datetime.datetime.now(), otpObj.otp_datetime)
            if datetime.datetime.now()-otpObj.otp_datetime.replace(tzinfo=None) > datetime.timedelta(minutes=3):
                otpObj.temp_user.delete()
                otpObj.delete()
                return JsonResponse({"message": "OTP verification time out"}, status=401)
            else:
                    
                    otp_resender(otpObj)
                    return JsonResponse({'message': 'OTP resend Success'}, status=200)
        else:
            return JsonResponse({'message': 'OTP not valid'}, status=401)
    else:
        return JsonResponse({'message': 'OTP verification Failed'}, status=401)


@api_view(['POST'])
def forgot_password(request):
    if request.data['email']:
        user=UserModel.objects.filter(email=request.data['email'])
        

    return JsonResponse({'message':''},status=200)