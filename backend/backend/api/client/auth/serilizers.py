from rest_framework import serializers
from api.models import UserModel

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserModel
    fields = ('username','first_name', 'last_name', 'email','profile')

class UserRegisterSerilizer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    dob=serializers.DateField()
    def validate(self, data):
        error={}
        if data['username']:
            if UserModel.objects.filter(username=data['username']).exists():
                error['username']='Username is already exists'
                # raise serializers.ValidationError({"username":""})
        if data['email']:
            if UserModel.objects.filter(email=data['email']).exists():
                error['email']='Email is already exists'
                # raise serializers.ValidationError({"email":'Email is already exists'})
        if error:
            raise serializers.ValidationError(error)
        return data
    def create(self, validated_data):
        user=UserModel(
                username=validated_data['username'],
                last_name=validated_data['last_name'],
                first_name=validated_data['first_name'],
                email=validated_data['email'],
                dob=validated_data['dob'],
            )
        user.set_password(validated_data['password'])
        user.save()
        return validated_data
    