from django.contrib import admin
from .models import User,Profile

admin.site.register(User)
admin.site.register(Profile)
admin.site.site_header = "FIX_IT Admin"
