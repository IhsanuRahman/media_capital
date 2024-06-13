from django.db import models

# Create your models here.

class Notifications(models.Model):
    title=models.CharField(max_length=50)
    description=models.TextField()
    is_active=models.BooleanField(default=True)
    sended_at=models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-sended_at']