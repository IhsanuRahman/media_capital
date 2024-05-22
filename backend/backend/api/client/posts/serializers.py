
from rest_framework import serializers

from api.models import Posts

class PostsSerilizer(serializers.Serializer):
    class Meta:
        model=Posts
        fields = "__all__"