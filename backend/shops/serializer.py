from rest_framework import serializers
from .models import Shop, SaveShop, PortfolioImage, DeviceType, Hours,ListShop,Favoris


class PortfolioImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioImage
        fields = ['id', 'image', 'caption']
        


class HoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hours
        fields = ['id', 'day', 'open_time', 'close_time']


class DeviceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceType
        fields = ['id', 'name']


class ShopSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    portfolio = PortfolioImageSerializer(many=True, read_only=True)
    hours = HoursSerializer(many=True, read_only=True)
   
    device_types = DeviceTypeSerializer(many=True, read_only=True)
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Shop
        fields = [
            'id',
            'owner',
            'name',
            'description',
            'wilaya',
            'city',
            'business_email',
            'phone',
            'address',
            'google_maps_link',
            'is_open',
            'rating',
            'total_reviews',
            'device_types',
            'portfolio',
            'hours',
            'created_at',
            'profile_image'
        ]

    def get_profile_image(self, obj):
        try:
            if obj.owner.profile.profile_picture:
                return obj.owner.profile.profile_picture.url
        except:
            pass
        return None
    
class SaveShopSerializer(serializers.ModelSerializer):
    shop = ShopSerializer(read_only=True)
    shop_id = serializers.PrimaryKeyRelatedField(
        queryset=Shop.objects.all(),
        source='shop',
        write_only=True
    )

    class Meta:
        model = SaveShop
        fields = ['id', 'shop', 'shop_id']

    def validate(self, attrs):
        user = self.context['request'].user  
        shop = attrs['shop']  

     
        if SaveShop.objects.filter(user=user, shop=shop).exists():
            raise serializers.ValidationError("Vous avez déjà sauvegardé ce shop.")

        return attrs



class ListShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListShop
        fields = ['id', 'user','shop']
    user = serializers.ReadOnlyField(source='user.username')
    shop = serializers.SerializerMethodField()
    def get_shop(self, obj):
        return [{'id': f.shop.id, 'note': f.note} for f in obj.favoris_set.all()]
   
class FavorisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favoris
        fields = ['id', 'shop', 'list_shop']