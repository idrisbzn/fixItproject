from .models import Review
from .serializer import ReviewSerializer
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from accounts.permission import IsOwnerOrReadOnly
from rest_framework.viewsets import ModelViewSet
from shops.models import Shop
from request.models import RepairRequest
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response    

class ReviewViewSet(ModelViewSet):
    
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Review.objects.all().order_by('-created_at')
        shop_id = self.request.query_params.get('shop')
        
        if shop_id:
            return queryset.filter(shop_id=shop_id)
            
        user = self.request.user
        if not user.is_authenticated:
            return Review.objects.none()
            
        if user.role == 'repairer':
            try:
                shop = Shop.objects.get(owner=user)
                return queryset.filter(shop=shop)
            except Shop.DoesNotExist:
                return Review.objects.none()
        
        return queryset.filter(user=user)
    
    
    def perform_create(self, serializer):
      user = self.request.user
      if user.role != 'client':
        raise ValidationError("Only clients can create reviews.")
    
      shop_id = self.request.data.get('shop')

      if not shop_id:
        raise ValidationError("shop est obligatoire")

      if not RepairRequest.objects.filter(client=user, shop_id=shop_id, status='completed').exists():
          raise ValidationError("Vous pouvez laisser un avis uniquement après la fin de la réparation.")

      serializer.save(
        user=self.request.user,
        shop_id=shop_id
    )
    def create(self, request, *args, **kwargs):
       serializer = self.get_serializer(data=request.data)
    
       if not serializer.is_valid():
        print(serializer.errors)  
        return Response(serializer.errors, status=400)

       self.perform_create(serializer)
       return Response(serializer.data, status=201)