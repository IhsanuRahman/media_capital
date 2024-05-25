
from rest_framework import serializers

from .models import Posts

class PostsSerilizer(serializers.Serializer):
    class Meta:
        model=Posts
        fields = "__all__"