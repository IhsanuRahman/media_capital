from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime
class UserModel(AbstractUser):
    profile=models.ImageField(default='/user_profiles/profile.png')
    is_banned=models.BooleanField(default=False)
    description=models.TextField()
    dob=models.DateField(default=datetime.date(2005,1,29))