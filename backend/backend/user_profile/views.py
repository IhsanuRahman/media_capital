import datetime
import uuid
from django.shortcuts import render
from django.http import JsonResponse
import json
import pytz
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from admin_auth.utils import admin_only
from client_auth.models import OTP, UserModel
from posts.models import Tags, Posts
from user_profile.serializers import UserUpdateSerilizer
from .serializers import  UserSerializer
from .serializers import CreateUserSerializer
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
            interests = json.loads(request.data.get('interests', ''))
            user.interests.all().delete()
            for intrst in interests:
                tag, created = Tags.objects.get_or_create(name=intrst)
                print(tag)
                tag.save()
                user.interests.add(tag)

            user.save()
            return JsonResponse({'message': 'user update success'}, status=200)
        else:
            return JsonResponse({'message': user.errors}, status=400)
    else:
        return JsonResponse({'message': 'user not found'}, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.user.id and 'old_password' in request.data and 'new_password' in request.data and 'confirm_password' in request.data:
        user = UserModel.objects.get(id=request.user.id)
        if request.data['new_password'] == request.data['confirm_password']:
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
    
#  -- admin -- 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_only
def get_users(request):
    data=UserSerializer(UserModel.all.filter(is_superuser=False),many=True).data
    print(data)
    return JsonResponse({'users':data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_only
def create_user(request):
    print(request.data)
    user = CreateUserSerializer(data=request.data)
    if user.is_valid():
        user = user.save()
        if user:
            return JsonResponse({
                'message': 'user is created',
            }, status=200)
    else:
        return JsonResponse(user.errors, status=403)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@admin_only    
def ban_user(request):
    user_id=request.data.get('user_id',None)
    if user_id:
        user=UserModel.all.filter(id=user_id).first()
        if user:
            user.is_banned=True
            user.save()
            return JsonResponse({'message':'user banned success'})
    return JsonResponse({'message':'user banned failed'})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@admin_only    
def unban_user(request):
    user_id=request.data.get('user_id',None)
    if user_id:
        user=UserModel.all.filter(id=user_id).first()
        if user:
            user.is_banned=False
            user.save()
            return JsonResponse({'message':'user banned success'})
    return JsonResponse({'message':'user banned failed'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_only   
def users_ops(request):
    op=request.data.get('users_op',None)
    ids=request.data.get('users')
    users=UserModel.all.filter(id__in=ids)
    if op=='del':
        users.delete()
        return JsonResponse({"message":'success'})
    elif op=='ban':
        users.update(is_banned=True)
        print(ids)
        return JsonResponse({"message":'success'})
    elif op=='unban':
        users.update(is_banned=False)
        print(ids)
        return JsonResponse({"message":'success'})
    return JsonResponse({'message':'not found '},status=404) 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_only
def get_user(request):
    id=request.query_params['id']
    if id :
        user=UserModel.all.get(id=id)
        user = UserSerializer(user)
        data = user.data
        intrsts=data['interests']
        intlist=[]
        supporters=[]
        userSup=UserModel.all.get(id=request.user.id).supportings.all()
        for supporter in data['supporters']:
            userData=UserSerializer(UserModel.all.get(id=supporter)).data
            if userSup.filter(id=supporter).exists() :
                userData['is_supporting'] = True
            else:userData['is_supporting']=False
            supporters.append(userData)
        data['supporters']=supporters
        supportings=[]
        for supporter in data['supportings']:
            userData=UserSerializer(UserModel.all.get(id=supporter)).data
            userData['is_supporting']=  True
            supportings.append(userData)
        data['supportings']=supportings
        for i in intrsts:
            intlist.append(Tags.objects.get(id=i).name)
        data['interests']=intlist
        return JsonResponse({'userData':data}) 
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_only
def edit_user(request):
    id=request.data['id']
    userObj=UserModel.all.get(id=id)
    user = UserUpdateSerilizer(instance=userObj, data=request.data)
    if user.is_valid():
            user.save()
            print(user)
            interests = json.loads(request.data.get('interests', ''))
            userObj.interests.all().delete()
            for intrst in interests:
                tag, created = Tags.objects.get_or_create(name=intrst)
                print(tag)
                tag.save()
                userObj.interests.add(tag)

            userObj.save()
            return JsonResponse({'message': 'user update success'}, status=200)
    else:
            return JsonResponse({'message': user.errors}, status=400)
    

