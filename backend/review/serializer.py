from .models import Review
from rest_framework import serializers

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_avatar = serializers.SerializerMethodField()
    shop_name = serializers.SerializerMethodField()

    repair_title = serializers.ReadOnlyField(source='repair_request.title')
    repair_model = serializers.ReadOnlyField(source='repair_request.model_name')

    shop_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'rating', 'comment', 'shop', 'repair_request', 
            'created_at', 'user_name', 'user_avatar', 'shop_name', 'shop_avatar',
            'repair_title', 'repair_model'
        ]
        read_only_fields = ['id', 'created_at', 'user_name', 'user_avatar', 'shop_name', 'shop_avatar', 'repair_title', 'repair_model'] 
    
    def get_user_name(self, obj):
        if obj.user:
            first = obj.user.first_name or ''
            last = obj.user.last_name or ''
            if first and last:
                return f"{first} {last[0]}."
            return obj.user.email
        return 'Anonymous'

    def get_user_avatar(self, obj):
        try:
            if obj.user and hasattr(obj.user, 'profile') and obj.user.profile.profile_picture:
                return obj.user.profile.profile_picture.url
        except:
            pass
        return None

    def get_shop_name(self, obj):
        if obj.shop:
            return obj.shop.name or 'Unknown Shop'
        return 'Unknown Shop'

    def get_shop_avatar(self, obj):
        try:
            if obj.shop and hasattr(obj.shop.owner, 'profile') and obj.shop.owner.profile.profile_picture:
                return obj.shop.owner.profile.profile_picture.url
        except:
            pass
        return None

    def create(self, validated_data):
        return super().create(validated_data)
    
