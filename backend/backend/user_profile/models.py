import uuid
from django.db import models


# Create your models here.

class EditEmail(models.Model):
    new_email=models.EmailField(("email address"), blank=True,unique=True)
    id=models.CharField(default=uuid.uuid4(),editable=False,unique=True,primary_key=True,max_length=120,)
    otp=models.ForeignKey('client_auth.OTP',on_delete=models.CASCADE)
    user=models.ForeignKey('client_auth.UserModel',on_delete=models.CASCADE)
    sended_at=models.DateTimeField(auto_now=True)