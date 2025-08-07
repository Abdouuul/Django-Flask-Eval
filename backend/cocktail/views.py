from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from cocktail.serializers import CocktailSerializer, IngredientSerializer
from cocktail.models import Cocktail, Ingredient


class CocktailViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CocktailSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Cocktail.objects.filter(user=self.request.user).order_by('-id')
    
class IngredientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = IngredientSerializer

    def get_queryset(self):
        return Ingredient.objects.all().order_by('-id')