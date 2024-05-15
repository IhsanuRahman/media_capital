import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime
class UserModel(AbstractUser):
    profile=models.ImageField(default='/user_profiles/profile.png')
    is_banned=models.BooleanField(default=False)
    description=models.TextField()
    dob=models.DateField(default=datetime.date(2005,1,29))

from api.models import UserModel as User
from django.db.models import Q


class Message(models.Model):
    message=models.TextField()
    sender=models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name='sender')
    receiver=models.ForeignKey(User,on_delete=models.DO_NOTHING)
    sended_at=models.DateTimeField(default=datetime.datetime.now())
   


class Rooms(models.Model):
    groupName = models.CharField(default=uuid.uuid4(), editable=False, unique=True,max_length=120)
    users = models.ManyToManyField(User,max_length=2,related_name='users')
    messages = models.ManyToManyField(
       Message,related_name='messages',null=True
    ) 

    