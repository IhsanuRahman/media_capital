import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime   
class Tags(models.Model):
    name=models.CharField( max_length=50,unique=True)
    def __str__(self):
        return self.name
class UserModel(AbstractUser):
    email = models.EmailField(("email address"), blank=True,unique=True)
    profile=models.ImageField(default='/user_profiles/profile.png',upload_to='user_profiles')
    banner=models.ImageField(null=True,upload_to='banners')
    is_banned=models.BooleanField(default=False)
    description=models.TextField()
    dob=models.DateField()
    supportings=models.ManyToManyField('UserModel',related_name='supporters')
    intresets=models.ManyToManyField(Tags,related_name='users')

 

class OTP(models.Model):
    id=models.CharField(default=uuid.uuid4(), editable=False, unique=True,max_length=120,primary_key=True)
    otp=models.BigIntegerField()
    otp_datetime=models.DateTimeField()


class Posts(models.Model):
    id=models.CharField(default=uuid.uuid4(), editable=False, unique=True,max_length=120,primary_key=True)
    content=models.ImageField()
    description=models.TextField(null=True)
    tags=models.ManyToManyField(Tags,related_name='posts')
    user=models.ForeignKey(UserModel,related_name='posts',on_delete=models.CASCADE)
    rating=models.FloatField(default=0.0)
    
class Ratings(models.Model):
    user=models.ForeignKey(UserModel,on_delete=models.CASCADE)
    post=models.ForeignKey(Posts,related_name='ratings',on_delete=models.CASCADE)
    rate=models.FloatField(default=0.0)

class Comments(models.Model):
    comment=models.TextField()
    user=models.ForeignKey(UserModel,related_name='Comments',on_delete=models.CASCADE)
    post=models.ForeignKey(Posts,related_name='comments',on_delete=models.CASCADE)

class ForgotPassword(models.Model):
    id=models.CharField(default=uuid.uuid4(), editable=False, unique=True,max_length=120,primary_key=True)
    secondary_code=models.CharField(default=uuid.uuid4(), editable=False, unique=True,max_length=120)
    user=models.ForeignKey(UserModel,on_delete=models.CASCADE)
    otp=models.ForeignKey(OTP,on_delete=models.CASCADE)
    sended_at=models.DateTimeField(auto_now=True)


class TempUser(models.Model):
    username=models.CharField(max_length=50)
    first_name=models.CharField(max_length=50)
    last_name=models.CharField(max_length=50)
    email=models.EmailField(max_length=50)
    password=models.CharField(max_length=50)
    stored_time=models.DateTimeField(auto_now=True)
    dob=models.DateField()
    otp=models.ForeignKey(OTP,on_delete=models.CASCADE)    


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

    