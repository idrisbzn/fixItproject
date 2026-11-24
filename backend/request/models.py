from django.db import models
from django.conf import settings
from shops.models import Shop

class RepairRequest(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('in_repair', 'In Repair'),
        ('ready', 'Ready for Pickup'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_requests'
    )

    shop = models.ForeignKey(
        Shop,
        on_delete=models.CASCADE,
        related_name='requests'
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    
    device_type = models.CharField(max_length=50, default='phone')
    model_name = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='repair_requests/', blank=True, null=True)
    shop_note = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client} → {self.shop} ({self.status})"
