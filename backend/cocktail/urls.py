from django.urls import path, include
from cocktail.views import CocktailViewSet, IngredientViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register('ingredients', IngredientViewSet, basename='ingredients')
router.register('cocktails', CocktailViewSet, basename='cocktails')