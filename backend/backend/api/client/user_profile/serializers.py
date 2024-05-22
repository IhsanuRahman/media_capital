
from rest_framework import serializers
from api.models import TempUser, UserModel

class UserUpdateSerilizer(serializers.ModelSerializer):
  class Meta:
    model = UserModel
    fields = ('id','username','dob','first_name', 'last_name', 'email','profile','description','banner') 
    def validate(self, data):
        print('validate')
        error={}
        if data['username']:
            if UserModel.objects.exclude(id=self.instance.id).filter(username=data['username']).exists() or TempUser.objects.filter(username=data['username']).exists():
                error['username']='Username is already exists'
                # raise serializers.ValidationError({"username":""})
        if data['email']:
            if UserModel.objects.exclude(id=self.instance.id).filter(email=data['email']).exists() or TempUser.objects.filter(email=data['email']).exists():
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
            if UserModel.objects.exclude(id=self.instance.id).filter(username=data['username']).exists() or TempUser.objects.filter(username=data['username']).exists():
                error['username']='Username is already exists'
                # raise serializers.ValidationError({"username":""})
        if data['email']:
            if UserModel.objects.exclude(id=self.instance.id).filter(email=data['email']).exists() or TempUser.objects.filter(email=data['email']).exists():
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
    