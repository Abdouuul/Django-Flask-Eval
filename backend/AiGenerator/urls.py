from django.urls import path
from AiGenerator.views import GeneratorView

urlpatterns =[
    path('generator/', GeneratorView.as_view())
]