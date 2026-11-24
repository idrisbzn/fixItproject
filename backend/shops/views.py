from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Shop, SaveShop, PortfolioImage, DeviceType,ListShop,Favoris
from .serializer import (
    ShopSerializer,
    SaveShopSerializer,
    PortfolioImageSerializer,
    DeviceTypeSerializer,
    ListShopSerializer,
    FavorisSerializer,
)
from rest_framework.decorators import action
from rest_framework.response import Response


from django.db.models import Q

class ShopViewSet(viewsets.ModelViewSet):
    serializer_class = ShopSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Shop.objects.all()
        wilaya = self.request.query_params.get('wilaya')
        city = self.request.query_params.get('city')
        device = self.request.query_params.get('device')

        if wilaya:
            queryset = queryset.filter(wilaya__icontains=wilaya)

        if city:
            queryset = queryset.filter(city__icontains=city)

        if device:
            device_list = [d.strip().lower() for d in device.split(',') if d.strip()]
            for d in device_list:
                if d == 'pc' or d == 'laptop':
                    queryset = queryset.filter(Q(device_types__name__icontains='pc') | Q(device_types__name__icontains='laptop'))
                elif d == 'phone' or d == 'tablet':
                    queryset = queryset.filter(Q(device_types__name__icontains='phone') | Q(device_types__name__icontains='tablet'))
                else:
                    queryset = queryset.filter(device_types__name__icontains=d)

        return  queryset.distinct().order_by('-rating', '-total_reviews')

    def perform_create(self, serializer):
        if self.request.user.role != 'repairer':
            raise PermissionDenied("Only repairers can create shops")
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[IsAuthenticated])
    def my_shop(self, request):
        """Get or update the authenticated repairer's own shop."""
        try:
            shop = Shop.objects.get(owner=request.user)
        except Shop.DoesNotExist:
            return Response({'error': 'You do not have a shop.'}, status=404)

        if request.method == 'GET':
            serializer = self.get_serializer(shop)
            return Response(serializer.data)

        # PUT or PATCH
        partial = request.method == 'PATCH'
        serializer = self.get_serializer(shop, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Handle device_types update if provided
        device_types_data = request.data.get('device_types_names')
        if device_types_data is not None:
            device_objs = []
            for dt_name in device_types_data:
                dt_obj, _ = DeviceType.objects.get_or_create(name=dt_name)
                device_objs.append(dt_obj)
            shop.device_types.set(device_objs)

        # Handle hours update if provided
        hours_data = request.data.get('hours_data')
        if hours_data is not None:
            from .models import Hours
            # Clear existing hours and recreate
            shop.hours.all().delete()
            for h in hours_data:
                Hours.objects.create(
                    shop=shop,
                    day=h['day'],
                    open_time=h['open_time'],
                    close_time=h['close_time'],
                )

        serializer.save()
        # Re-serialize to include updated relations
        result_serializer = self.get_serializer(shop)
        return Response(result_serializer.data)
    


class SaveShopViewSet(viewsets.ModelViewSet):
    serializer_class = SaveShopSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SaveShop.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != 'client':
            raise PermissionDenied("Only clients can save shops")
        serializer.save(user=self.request.user)

class ListShopViewSet(viewsets.ModelViewSet):
    
    serializer_class = ListShopSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ListShop.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def add_shop(self, request):
        shop_id = request.data.get('shop_id')
        note = request.data.get('note', '')
        try:
            shop = Shop.objects.get(id=shop_id)
        except Shop.DoesNotExist:
            return Response({'error': 'Shop not found'}, status=404)

        list_shop, created = ListShop.objects.get_or_create(user=request.user)
        favoris, f_created = Favoris.objects.get_or_create(list_shop=list_shop, shop=shop)
        if note:
            favoris.note = note
            favoris.save()
            
        return Response({'message': 'Shop added to your list'}, status=200)
    
    @action(detail=False, methods=['post'])
    def remove_shop(self, request):
        shop_id = request.data.get('shop_id')
        try:
            shop = Shop.objects.get(id=shop_id)
        except Shop.DoesNotExist:
            return Response({'error': 'Shop not found'}, status=404)

        list_shop = ListShop.objects.filter(user=request.user).first()
        if list_shop:
            Favoris.objects.filter(list_shop=list_shop, shop=shop).delete()
            return Response({'message': 'Shop removed from your list'}, status=200)
        return Response({'error': 'You do not have a list of shops'}, status=404)
    
    @action(detail=False, methods=['post', 'patch'], url_path='update-note')
    def update_note(self, request):
        try:
            shop_id = request.data.get('shop_id')
            note = request.data.get('note', '')
            
            if not shop_id:
                return Response({'error': 'Shop ID is required'}, status=400)

            try:
                shop = Shop.objects.get(id=shop_id)
            except Shop.DoesNotExist:
                return Response({'error': f'Shop with ID {shop_id} not found'}, status=404)

            # Ensure the user has a list
            list_shop, _ = ListShop.objects.get_or_create(user=request.user)

            # Find or create the Favoris entry
            favoris, created = Favoris.objects.get_or_create(list_shop=list_shop, shop=shop)

            favoris.note = note
            favoris.save()
            
            return Response({'message': 'Note updated successfully', 'note': favoris.note}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    
    
class PortfolioImageViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PortfolioImage.objects.filter(shop__owner=self.request.user)

    def perform_create(self, serializer):
        try:
            shop = Shop.objects.get(owner=self.request.user)
            serializer.save(shop=shop)
        except Shop.DoesNotExist:
            raise PermissionDenied("You must own a shop to upload portfolio images.")


class DeviceTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DeviceType.objects.all()
    serializer_class = DeviceTypeSerializer
    permission_classes = [AllowAny]