from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps

class User(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True)  
    
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('repairer', 'Repairer'),
    ]
    USERNAME_FIELD = "email"
    email = models.EmailField(unique=True)  
    role = models.CharField(max_length=20, blank=True, choices=ROLE_CHOICES, default='client')
    wilaya = models.CharField(max_length=40, blank=True,null=True)
    city = models.CharField(max_length=40, blank=True,null=True)
    
    
    REQUIRED_FIELDS = ['username'] 
    
    def __str__(self):
        return self.email 
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
 
    def __str__(self):
        return f"{self.user.username}'s Profile"




