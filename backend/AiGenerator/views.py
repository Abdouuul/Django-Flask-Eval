from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from AiGenerator.generator import generator_graph, GeneratorState

# Create your views here.


class GeneratorView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
            message = request.data.get('message')

            initial_state = GeneratorState(
                  message=message,
                  user_id=request.user.id
            )
            result = generator_graph.invoke(initial_state)

            return Response({"reply": result['reply']}, status=201)