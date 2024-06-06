import datetime
import uuid
from django.shortcuts import render
from django.http import JsonResponse
import json
import pytz
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from client_auth.models import OTP, UserModel
from posts.models import Tags, Posts
from user_profile.serializers import UserUpdateSerilizer
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import EditEmail
from client_auth.utils import otp_generator, otp_resender
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
        return JsonResponse({'message': 'user not found'}, status=400)


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
            else:
                return JsonResponse({'message': 'old password are not match'}, status=404)
        return JsonResponse({'message': 'passwords are not match'}, status=404)
    return JsonResponse({'message': 'not found'}, status=404)


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
    return JsonResponse({'message':'not found'},status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def support(request):
    id=request.data.get("id")
    if id:
        user=UserModel.objects.get(id=id)
        supporter=UserModel.objects.get(id=request.user.id)
        if user==supporter:
            return JsonResponse({'message':'self support not allowed'},status=400)
        if user in supporter.supportings.all():
            supporter.supportings.remove(user)
            print('unsuport',user,supporter)
            return JsonResponse({'message':'unsupported'},status=201)
        print('suport',user,supporter.supportings.all())
        supporter.supportings.add(user)
        return JsonResponse({'message':'supported'},status=201)
    return JsonResponse({'message':'not found'},status=400)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def edit_email(request):
    email=request.data.get('email',None)
    if not email:
        return JsonResponse({'message':'email is required'},status=400)
    try:
        validate_email(email)
    except ValidationError as err:
        return JsonResponse({'message':err.message},status=400)
    if EditEmail.objects.filter(new_email=email).exists():
        obj=EditEmail.objects.filter(new_email=email).first()
        if datetime.datetime.now(pytz.timezone('Asia/Kolkata'))-obj.otp.otp_datetime > datetime.timedelta(minutes=3):
            obj.otp.delete()
            obj.delete()
        else:
            return JsonResponse({'message':'email already used'},status=400)

    if UserModel.objects.filter(email=email).exists():
        if UserModel.objects.filter(id=request.user.id,email=email):
            return JsonResponse({'message':'new email is same as old email'},status=400)
        return JsonResponse({'message':'email already used'},status=400)
    
    editObj=EditEmail(id=uuid.uuid4(),new_email=email,user=UserModel.objects.get(id=request.user.id))
    otpObj=otp_generator(email=email)
    otpObj.save()
    editObj.otp=otpObj
    editObj.save()
    return JsonResponse({'token':editObj.id})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def email_verify(request):
    user=UserModel.objects.get(id=request.user.id)
    objId=request.data.get('token',None)
    otp=request.data.get('otp')
    if objId:
        editObj=EditEmail.objects.filter(id=objId,user=user)
        if datetime.datetime.now(pytz.timezone('Asia/Kolkata'))-editObj.first().otp.otp_datetime > datetime.timedelta(minutes=3):
            editObj.first().otp.delete()
            editObj.first().delete()
            return JsonResponse({'message':'otp is time out'},status=400)
        if editObj.exists():
            if editObj.filter(otp__otp=otp):
                editObj=editObj.first()
                user.email=editObj.new_email
                user.save()
                editObj.otp.delete()
                editObj.delete()
                return JsonResponse({'message':'edit email success'})
            else:
                return JsonResponse({'message':'invalid otp'},status=400)  
    return JsonResponse({'message':'credential not valid'},status=400)          
    
    
@api_view(['GET', 'POST'])
def resend_otp(request):
    if request.data['token']:
        user=UserModel.objects.get(id=request.user.id)
        otpObj = EditEmail.objects.filter(
             id=request.data['token'],user=user).first().otp
        if otpObj:
            print(datetime.datetime.now(), otpObj.otp_datetime)
            if datetime.datetime.now(pytz.timezone('Asia/Kolkata'))-otpObj.otp_datetime >= datetime.timedelta(minutes=1):
                otpObj=otp_resender(otpObj,user.email)
                otpObj.save()
                return JsonResponse({'message': 'OTP resend Success'}, status=200)
                
            else:
                return JsonResponse({"message": "OTP resend only after 1 minute"}, status=400)
                    
                    
        else:
            return JsonResponse({'message': 'credentials are not valid'}, status=400)
    else:
        return JsonResponse({'message': 'OTP verification Failed'}, status=400)