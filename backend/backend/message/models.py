import uuid
from client_auth.models import UserModel as User
from django.db import models


class MessageModel(models.Model):
    message=models.TextField()
    sender=models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name='sender')
    receiver=models.ForeignKey(User,on_delete=models.DO_NOTHING)
    sended_at=models.DateTimeField(auto_now_add=True)
   


class Rooms(models.Model):
    groupName = models.CharField(default=uuid.uuid4(), editable=False, unique=True,max_length=120)
    users = models.ManyToManyField(User,max_length=2,related_name='users')
    messages = models.ManyToManyField(
       MessageModel,related_name='messages'
    ) 
