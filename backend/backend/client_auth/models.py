import datetime
import uuid
from django.db import models

from django.contrib.auth.models import AbstractUser,UserManager
from django.db.models.signals import pre_init
from django.dispatch import receiver

from posts import models as postModels



class BanManager(UserManager):
    def get_queryset(self) :
        return super().get_queryset().filter(is_banned=False)
    def get_by_natural_key(self, username):
        return self.get(username=username)
   
    

# Create your models here.
class UserModel(AbstractUser):
    email = models.EmailField(("email address"), blank=True,unique=True)
    profile=models.ImageField(default='/user_profiles/profile.png',upload_to='user_profiles')
    banner=models.ImageField(null=True,upload_to='banners')
    is_banned=models.BooleanField(default=False)
    description=models.TextField(null=True)
    dob=models.DateField(null=False)
    supportings=models.ManyToManyField('UserModel',related_name='supporters')
    blocked_users=models.ManyToManyField('UserModel',related_name='blocker')
    objects=BanManager()
    all=models.Manager()
    REQUIRED_FIELDS=['dob','email']

class OTP(models.Model):
    id=models.CharField(default=uuid.uuid4(), editable=False, unique=True,max_length=120,primary_key=True)
    otp=models.BigIntegerField()
    otp_datetime=models.DateTimeField()


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


@receiver(pre_init,sender=TempUser)
def user_preinit(sender,**kwargs):
    
    print('started accessing TempUser')

@receiver(pre_init,sender=OTP)
def user_preinit(sender,**kwargs):
    print('started accessing OTP')