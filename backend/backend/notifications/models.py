from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from client_auth.models import UserModel

# Create your models here.

class Notifications(models.Model):
    title=models.CharField(max_length=50)
    description=models.TextField()
    is_active=models.BooleanField(default=True)
    sended_at=models.DateTimeField(auto_now_add=True)
    user=models.ForeignKey(UserModel,on_delete=models.CASCADE,null=True)
    class Meta:
        ordering = ['-sended_at']
    
@receiver(post_save, sender=Notifications)
def notification_created(sender, instance, created, **kwargs):
    print(created,'is ')
    if created:
        channel_layer = get_channel_layer()
        if instance.user is not None:
            async_to_sync(channel_layer.group_send)("notification_"+instance.user.id, {
                        "type": "send_notification",
                        'data':{"title":instance.title,
                        "description":instance.description}
                                
                        })
        else:
            for user in UserModel.objects.all().values():
                async_to_sync(channel_layer.group_send)("notification_"+str(user['id']), {
                        "type": "send_notification",
                        'data':{"title":instance.title,
                        "description":instance.description}
                                
                        })
