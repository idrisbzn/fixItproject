from . import models
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from shops.models import Shop, DeviceType
from django.apps import apps

class UserSerializer(serializers.ModelSerializer):
    shop_id = serializers.SerializerMethodField()
    profile_picture = serializers.ImageField(source='profile.profile_picture', required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'wilaya', 'city', 'role', 'shop_id', 'first_name', 'last_name', 'date_joined', 'profile_picture']
        read_only_fields = ['date_joined']
    
    def get_shop_id(self, obj):
        if obj.role == 'repairer' and hasattr(obj, 'shop'):
            return obj.shop.id
        return None
        
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if profile_data is not None:
            profile, created = models.Profile.objects.get_or_create(user=instance)
            if 'profile_picture' in profile_data:
                profile.profile_picture = profile_data['profile_picture']
            profile.save()
            
        return instance
        
class AuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError('Invalid credentials')  
        data['user'] = user
        return data
    

class SignupSerializer(serializers.ModelSerializer):

    device_type = serializers.ListField(child=serializers.CharField(), required=False)
    shop_name = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number','city', 'wilaya', 'role', 'device_type', 'shop_name', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True},
                      'wilaya': {'required':False, 'allow_blank': True},
                       'city': {'required':False, 'allow_blank': True},

                       'device_type':{'required':False }, }
           
        
    def validate_username(self, value):
        if User.objects.filter(username = value).exists():
           raise serializers.ValidationError('the username already exists')
        return value
    
    def validate_email(self,value):
        if User.objects.filter(email = value).exists():
            raise serializers.ValidationError('email already exists')
        return value
    
    def validate(self, attrs):
        role = attrs.get('role')
        if role == 'repairer':
            if not attrs.get('wilaya'):
             raise serializers.ValidationError('wilaya is required for repairers')   
            if not attrs.get('city'):
             raise serializers.ValidationError('city is required for repairers.')
        return attrs
    
    def create(self, validated_data):

        device_type = validated_data.pop('device_type',[])
        shop_name = validated_data.pop('shop_name', None)
        user = User.objects.create_user(**validated_data)
        role = validated_data.get('role')
        if role == 'repairer':
            username = validated_data.get('username', '')
            email = validated_data.get('email', '')
            city = validated_data.get('city', 'Ville non renseignée')
            wilaya = validated_data.get('wilaya', 'Wilaya non renseignée')
            phone_number = validated_data.get('phone_number', '0000000000')
            
            shop = Shop.objects.create(
                owner=user,
                name=shop_name or username,
                description='',
                wilaya=wilaya,
                city=city,
                business_email=email,
                phone=phone_number,
                address=f"{city}, {wilaya}",
            )

            
            # Map strings to DeviceType objects
            device_objs = []
            for dt_name in device_type:
                dt_obj, _ = DeviceType.objects.get_or_create(name=dt_name)
                device_objs.append(dt_obj)
            shop.device_types.set(device_objs)
            
        return user


 
            
            
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value

    def validate_new_password(self, value):
        if not value:
            raise serializers.ValidationError('New password cannot be empty.')
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user

class DeleteAccountSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Password is incorrect.')
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.delete()
        return None