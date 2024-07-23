import uuid
from client_auth.models import UserModel as User
from django.db import models
from django.db.models import Q

class BanManger(models.Manager):
    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset().filter(Q(sender__is_banned=False)&Q(receiver__is_banned=False))

class MessageModel(models.Model):
    message=models.TextField()
    sender=models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name='sender')
    receiver=models.ForeignKey(User,on_delete=models.DO_NOTHING)
    sended_at=models.DateTimeField(auto_now_add=True)
    
    objects=BanManger()
    all=models.Manager()

class RoomBanManager(models.Manager):
    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset().filter(users__is_banned=False)

class Rooms(models.Model):
    groupName = models.CharField(default=uuid.uuid4(), editable=False, unique=True,max_length=120)
    users = models.ManyToManyField(User,max_length=2,related_name='rooms')
    messages = models.ManyToManyField(
       MessageModel,related_name='rooms'
    ) 
    objects=RoomBanManager()
    all=models.Manager()

