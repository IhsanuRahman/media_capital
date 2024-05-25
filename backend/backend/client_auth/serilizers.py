from rest_framework import serializers
from .models import TempUser, UserModel

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserModel
    fields = ('id','username','dob','first_name', 'last_name', 'email','profile','is_staff','description','intresets','banner','supporters','supportings')

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
            if UserModel.objects.filter(username=data['username']).exists() or TempUser.objects.filter(username=data['username']).exists():
                error['username']='Username is already exists'
                # raise serializers.ValidationError({"username":""})
        if data['email']:
            if UserModel.objects.filter(email=data['email']).exists() or TempUser.objects.filter(email=data['email']).exists():
                error['email']='Email is already exists'
                # raise serializers.ValidationError({"email":'Email is already exists'})
        if error:
            raise serializers.ValidationError(error)
        return data
    def create(self, validated_data):
        user=TempUser(
                username=validated_data['username'],
                last_name=validated_data['last_name'],
                first_name=validated_data['first_name'],
                email=validated_data['email'],
                dob=validated_data['dob'],
                password=validated_data['password']
        )
        return user
    