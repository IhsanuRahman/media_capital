import uuid
from django.db import models
from client_auth.models import UserModel
# Create your models here.

class Tags(models.Model):
    name=models.CharField( max_length=50,unique=True)
    users=models.ManyToManyField(to=UserModel,related_name='intresets')
    def __str__(self):
        return self.name
    
class Posts(models.Model):
    id=models.CharField(default=uuid.uuid4(), editable=False, unique=True,max_length=120,primary_key=True)
    content=models.ImageField()
    description=models.TextField(null=True)
    tags=models.ManyToManyField(Tags,related_name='posts')
    user=models.ForeignKey(UserModel,related_name='posts',on_delete=models.CASCADE)
    rating=models.FloatField(default=0.0)
    posted_at=models.DateTimeField(auto_now_add=True)
    saved_users=models.ManyToManyField(UserModel,related_name='saved_posts')
    class Meta:
        ordering = ['-posted_at']
    
class Ratings(models.Model):
    user=models.ForeignKey(UserModel,on_delete=models.CASCADE)
    post=models.ForeignKey(Posts,related_name='ratings',on_delete=models.CASCADE)
    rate=models.FloatField(default=0.0)

class Comments(models.Model):
    comment=models.TextField()
    user=models.ForeignKey(UserModel,related_name='Comments',on_delete=models.CASCADE)
    post=models.ForeignKey(Posts,related_name='comments',on_delete=models.CASCADE)
    posted_at=models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-posted_at']

class CommentsReply(models.Model):
    reply=models.TextField()
    user=models.ForeignKey(UserModel,related_name='replys',on_delete=models.CASCADE)
    comment=models.ForeignKey(Comments,related_name='replys',on_delete=models.CASCADE)
    posted_at=models.DateTimeField(auto_now_add=True)