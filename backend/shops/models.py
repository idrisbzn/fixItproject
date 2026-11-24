from django.db import models
from django.conf import settings


class Shop(models.Model):

    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='shop',
        limit_choices_to={'role': 'repairer'}
          
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    wilaya = models.CharField(max_length=40)
    city = models.CharField(max_length=40)
    business_email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    google_maps_link = models.URLField(blank=True) 
    is_open = models.BooleanField(default=True)
    rating = models.FloatField(default=0)
    total_reviews = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return self.name

class PortfolioImage(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='portfolio')
    image = models.ImageField(upload_to='portfolio/')
    caption = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class DeviceType(models.Model):
    name = models.CharField(max_length=50,unique=True)  
    shops = models.ManyToManyField(Shop, related_name='device_types')
    
    def __str__(self):
        return self.name

class Hours(models.Model):
    DAYS_OF_WEEK = [
        ('monday', 'Lundi'),
        ('tuesday', 'Mardi'),
        ('wednesday', 'Mercredi'),
        ('thursday', 'Jeudi'),
        ('friday', 'Vendredi'),
        ('saturday', 'Samedi'),
        ('sunday', 'Dimanche'),
    ]
    day = models.CharField(max_length=100,choices=DAYS_OF_WEEK)
    open_time = models.TimeField()
    close_time = models.TimeField()
    shop = models.ForeignKey(Shop,related_name='hours',on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.shop.name} - {self.day}'
    class Meta:
        unique_together = ['shop','day']
        ordering = ['day']
    
class SaveShop(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop,on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ['user','shop']

class ListShop(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    shop = models.ManyToManyField(Shop, through='Favoris')

class Favoris(models.Model):
    shop = models.ForeignKey(Shop,on_delete=models.CASCADE)
    list_shop = models.ForeignKey(ListShop,on_delete=models.CASCADE)
    note = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ['shop', 'list_shop']
    