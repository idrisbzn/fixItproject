from django.db import models
from django.conf import settings
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg
from shops.models import Shop

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    repair_request = models.OneToOneField('request.RepairRequest', on_delete=models.CASCADE, related_name='review', null=True, blank=True)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Review {self.id} - Rating: {self.rating}"


@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_shop_review_stats(sender, instance, **kwargs):
    shop = instance.shop
    stats = Review.objects.filter(shop=shop).aggregate(avg_rating=Avg('rating'), count=models.Count('id'))
    shop.rating = stats['avg_rating'] or 0
    shop.total_reviews = stats['count'] or 0
    shop.save(update_fields=['rating', 'total_reviews'])


