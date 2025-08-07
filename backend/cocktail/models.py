from django.db import models
from django.contrib.auth.models import User

    
class Cocktail(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000, null=True)
    ingredients = models.ManyToManyField('Ingredient', related_name='cocktails')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cocktails')
    music_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    generated_image = models.ImageField(upload_to='cocktail_images/', null=True, blank=True)

    def __str__(self):
        return self.name
    
class Ingredient(models.Model):
    name = models.CharField(unique=True, max_length=100)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.name
