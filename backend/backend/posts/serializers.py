
from rest_framework import serializers
from client_auth.serilizers import UserSerializer
from .models import Comments, CommentsReply, Posts, Reports, Tags

class PostsSerilizer(serializers.ModelSerializer):
    class Meta:
        model=Posts
        fields = "__all__"

class TagsSerilizer(serializers.ModelSerializer):
    
    class Meta:
        model=Tags
        fields = "__all__"
class ReportSerilizer(serializers.ModelSerializer):
    reported_username=serializers.CharField(source='user.username')
    suspect_username=serializers.CharField(source='post.user.username')
    class Meta:
        model=Reports
        fields=('reson','detail','id','user','post','reported_username','is_action_taked','suspect_username','reported_at','action_type','is_action_taked') 

class ReplySerilizers(serializers.ModelSerializer):
    username=serializers.CharField(source='user.username')
    user=UserSerializer()
    
    class Meta:
        model=CommentsReply
        fields = "__all__"

class CommentSerilizers(serializers.ModelSerializer):
    username=serializers.CharField(source='user.username')
    user=serializers.CharField(source='user.username')
    profile=serializers.CharField(source='user.profile.url')

    class Meta:
        model=Comments
        fields = "__all__"