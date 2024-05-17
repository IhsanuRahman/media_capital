import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime
class UserModel(AbstractUser):
    profile=models.ImageField(default='/user_profiles/profile.png')
    is_banned=models.BooleanField(default=False)
    description=models.TextField()
    dob=models.DateField()


class TempUser(models.Model):
    username=models.CharField(max_length=50)
    first_name=models.CharField(max_length=50)
    last_name=models.CharField(max_length=50)
    email=models.EmailField(max_length=50)
    password=models.CharField(max_length=50)
    stored_time=models.DateTimeField(auto_now=True)
    dob=models.DateField()

class OTP(models.Model):
    id=models.CharField(default=uuid.uuid4(), editable=False, unique=True,max_length=120,primary_key=True)
    otp=models.BigIntegerField()
    otp_datetime=models.DateTimeField()
    temp_user=models.ForeignKey(TempUser,on_delete=models.CASCADE)
    

from api.models import UserModel as User


class Message(models.Model):
    message=models.TextField()
    sender=models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name='sender')
    receiver=models.ForeignKey(User,on_delete=models.DO_NOTHING)
    sended_at=models.DateTimeField(auto_now_add=True)
   


class Rooms(models.Model):
    groupName = models.CharField(default=uuid.uuid4(), editable=False, unique=True,max_length=120)
    users = models.ManyToManyField(User,max_length=2,related_name='users')
    messages = models.ManyToManyField(
       Message,related_name='messages'
    ) 

    