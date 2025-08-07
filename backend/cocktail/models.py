from django.db import models
from django.contrib.auth.models import User

    
class Cocktail(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000, null=True)
    ingredients = models.ManyToManyField('Ingredient', related_name='cocktails')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cocktails')
    music_type = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Ingredient(models.Model):
    name = models.CharField(unique=True, max_length=100)

    def __str__(self):
        return self.name
