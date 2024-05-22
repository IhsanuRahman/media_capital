from django.contrib import admin
from .models import Posts, Tags, TempUser, UserModel
# Register your models here.


admin.site.register(UserModel)
admin.site.register(TempUser)
admin.site.register(Tags)
admin.site.register(Posts)