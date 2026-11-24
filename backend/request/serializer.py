from rest_framework import serializers
from .models import RepairRequest

class RequestSerializer(serializers.ModelSerializer):
    client = serializers.ReadOnlyField(source='client.username')
    client_phone = serializers.ReadOnlyField(source='client.phone_number')
    shop_name = serializers.ReadOnlyField(source='shop.name')

    is_reviewed = serializers.SerializerMethodField()

    class Meta:
        model = RepairRequest
        fields = [
            'id', 'client', 'client_phone', 'shop', 'shop_name', 
            'title', 'description', 'device_type', 'model_name', 
            'image', 'shop_note', 'status', 'created_at', 'updated_at', 'is_reviewed'
        ]

    def get_is_reviewed(self, obj):
        return hasattr(obj, 'review')