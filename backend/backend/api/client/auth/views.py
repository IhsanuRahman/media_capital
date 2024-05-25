import datetime
import uuid
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from api.client.auth.serilizers import UserRegisterSerilizer, UserSerializer
from api.client.auth.utils import otp_generator, otp_resender
from api.models import OTP, ForgotPassword, Tags, TempUser, UserModel


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
            otpObj = otp_generator( user)
            user.otp=otpObj
            user.stored_time=datetime.datetime.now()
            otpObj.save()
            user.save()
            return JsonResponse({
                'message': 'user is created',
                'token': otpObj.id
            }, status=200)
    else:
        return JsonResponse(user.errors, status=403)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    user = UserSerializer(user)
    
    data = user.data
    intrsts=data['intresets']
    intlist=[]
    for i in intrsts:
        intlist.append(Tags.objects.get(id=i).name)
    data['intresets']=intlist
    
    # for i in range(len(data['intresets'])):
    #     print(data['intresets'][i].name)
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
        temp_user = TempUser.objects.filter(
            otp__otp=request.data['otp'], otp__id=request.data['token'])
        if temp_user.exists():
            temp_user=temp_user.first()
            otpObj = temp_user.otp
            print(datetime.datetime.now(), otpObj.otp_datetime)
            if datetime.datetime.now()-otpObj.otp_datetime.replace(tzinfo=None) > datetime.timedelta(minutes=3):
                temp_user.delete()
                otpObj.delete()
                return JsonResponse({"message": "OTP verification time out"}, status=401)
            else:
                    user=UserModel(
                        username=temp_user.username,
                        first_name=temp_user.first_name,
                        last_name=temp_user.last_name,
                        email=temp_user.email,
                        dob=temp_user.dob
                    )
                    user.set_password(temp_user.password)
                    user.save()
                    temp_user.delete()
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
            temp_user=TempUser.objects.filter(otp=otpObj).first()
            print(datetime.datetime.now(), otpObj.otp_datetime)
            if datetime.datetime.now()-otpObj.otp_datetime.replace(tzinfo=None) >= datetime.timedelta(minutes=1):
                otpObj=otp_resender(otpObj,TempUser.objects.filter(otp=otpObj).first().email)
                otpObj.save()
                return JsonResponse({'message': 'OTP resend Success'}, status=200)
                
            else:
                return JsonResponse({"message": "OTP resend only after 1 minute"}, status=401)
                    
                    
        else:
            return JsonResponse({'message': 'OTP not valid'}, status=401)
    else:
        return JsonResponse({'message': 'OTP verification Failed'}, status=401)


@api_view(['POST'])
def forgot_password(request):
    if request.data['email']:
        user=UserModel.objects.filter(email=request.data['email'])
        FPObj=ForgotPassword.objects.filter(user__email=request.data['email'])
        if FPObj.exists():
            if datetime.datetime.now()-FPObj.first().sended_at.replace(tzinfo=None)> datetime.timedelta(minutes=3):
                FPObj.delete()
            else:
                return  JsonResponse({'message':'another request is in progress'},status=401) 
        if user.exists():
            user=user.first()
            otpObj=otp_generator(user,user.email)
            otpObj.save()
            forgotObj=ForgotPassword(id=uuid.uuid4(),secondary_code=uuid.uuid4(),user=user,otp=otpObj,sended_at=datetime.datetime.now())
            forgotObj.save()
            return JsonResponse({'token':forgotObj.id})
        else:
           return JsonResponse({'message':'email not found'},status=401) 

    return JsonResponse({'message':''},status=200)

@api_view(['POST'])
def verify_with_email(request):
    if request.data['otp'] and request.data['token']:
        forgotObj=ForgotPassword.objects.filter(otp__otp=request.data['otp'],id=request.data['token'])
        if forgotObj.exists():
            forgotObj=forgotObj.first()
            return JsonResponse({'token':forgotObj.secondary_code},status=200)
        else:
            return JsonResponse({'message':'otp is not corrent'},status=401)
    elif not request.data['otp']:
        return JsonResponse({'message':'otp is required'},status=401)
    else:
        return JsonResponse({'message':'credential missing'},status=401)

@api_view(['POST'])
def fp_change_password(request):
    if request.data['token'] and request.data['password']:
        forgotObj=ForgotPassword.objects.filter(secondary_code=request.data['token'])
        if forgotObj.exists():
            forgotObj=forgotObj.first()
            if forgotObj.user.check_password(request.data['password']):
                return JsonResponse({'details':'current and new password are same'})
            else:
                forgotObj.user.set_password(request.data['password'])
                forgotObj.user.save()
                forgotObj.otp.delete()
                forgotObj.delete()
                return JsonResponse({'message':'succes'},status=200)
        else:
            print('hai')
            return JsonResponse({'details':'session error'},status=401)
    return JsonResponse({'details':'no cred'},status=401)



@api_view([ 'POST'])
def fp_resend_otp(request):
    if request.data['token']:
        forgotObj = ForgotPassword.objects.filter(
             id=request.data['token'])
        if forgotObj.exists(): 
            forgotObj = forgotObj.first()
            print(datetime.datetime.now(), forgotObj.sended_at)
            if datetime.datetime.now()-forgotObj.sended_at.replace(tzinfo=None) >= datetime.timedelta(minutes=1):
                otpObj=otp_resender(forgotObj.otp,ForgotPassword.objects.filter(otp=forgotObj.otp).first().user.email)
                forgotObj.sended_at=datetime.datetime.now()
                otpObj.save()
                forgotObj.save()
                return JsonResponse({'message': 'OTP resend Success'}, status=200)
                
            else:
                return JsonResponse({"message": "OTP resend only after 1 minute"}, status=401)
                    
                    
        else:
            return JsonResponse({'message': 'OTP not valid'}, status=401)
    else:
        return JsonResponse({'message': 'OTP verification Failed'}, status=401)