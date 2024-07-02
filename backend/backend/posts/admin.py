from django.contrib import admin

from .models import Reports,Posts

admin.site.register([Reports,Posts])
