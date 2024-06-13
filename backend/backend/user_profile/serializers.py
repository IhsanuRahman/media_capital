
from rest_framework import serializers
from client_auth.models import TempUser, UserModel

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserModel
    fields = ('id','username','dob','first_name', 'last_name', 'email','profile','is_banned','is_staff','description','interests','banner','supporters','supportings')


class UserUpdateSerilizer(serializers.ModelSerializer):
  class Meta:
    model = UserModel
    fields = ('id','username','dob','first_name', 'last_name', 'email','profile','description','banner') 
    def validate(self, data):
        print('validate')
        error={}
        if data['username']:
            if UserModel.all.exclude(id=self.instance.id).filter(username=data['username']).exists() or TempUser.objects.filter(username=data['username']).exists():
                error['username']='Username is already exists'
                # raise serializers.ValidationError({"username":""})
        if data['email']:
            if UserModel.all.exclude(id=self.instance.id).filter(email=data['email']).exists() or TempUser.objects.filter(email=data['email']).exists():
                error['email']='Email is already exists'
                # raise serializers.ValidationError({"email":'Email is already exists'})
        if error:
            raise serializers.ValidationError(error)
        return data

class UserUpdateSerilizerT(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    profile=serializers.ImageField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    dob=serializers.DateField()
    description=serializers.CharField()
    def validate(self, data):
        error={}
        if data['username']:
            if UserModel.all.exclude(id=self.instance.id).filter(username=data['username']).exists() or TempUser.objects.filter(username=data['username']).exists():
                error['username']='Username is already exists'
                # raise serializers.ValidationError({"username":""})
        if data['email']:
            if UserModel.all.exclude(id=self.instance.id).filter(email=data['email']).exists() or TempUser.objects.filter(email=data['email']).exists():
                error['email']='Email is already exists'
                # raise serializers.ValidationError({"email":'Email is already exists'})
        if error:
            raise serializers.ValidationError(error)
        return data
    
    def update(self, instance, validated_data):
        print(instance.first_name)
        instance.username=validated_data.get('username',instance.username)
        instance.first_name=validated_data.get('first_name',instance.first_name)
        instance.last_name=validated_data.get('last_name',instance.last_name)
        instance.description=validated_data.get('description',instance.description)
        instance.dob=validated_data.get('dob',instance.dob)
        instance.email=validated_data.get('email',instance.email)
        instance.save()
        print(instance,'instance')
        return instance
    
class CreateUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    dob=serializers.DateField()
    def validate(self, data):
        error={}
        if data['username']:
            if UserModel.all.filter(username=data['username']).exists() or TempUser.objects.filter(username=data['username']).exists():
                
                error['username']='Username is already exists'
                # raise serializers.ValidationError({"username":""})
        if data['email']:
            if UserModel.all.filter(email=data['email']).exists() or TempUser.objects.filter(email=data['email']).exists():
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
        return user
    
