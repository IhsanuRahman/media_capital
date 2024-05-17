from django.contrib import admin
from .models import TempUser, UserModel
# Register your models here.
admin.site.register(UserModel)
admin.site.register(TempUser)