from django.db import models

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