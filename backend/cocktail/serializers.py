from rest_framework import serializers
from cocktail.models import Cocktail, Ingredient


class IngredientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id' , 'name']


class CocktailSerializer(serializers.HyperlinkedModelSerializer):
    ingredients = IngredientSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Cocktail
        fields = ['id', 'name', 'description', 'ingredients', 'music_type', 'generated_image']