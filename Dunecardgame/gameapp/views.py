from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Card
from .serializers import CardSerializer
import logging

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

def get_cards(request):
    cards = list(Card.objects.values())
    return JsonResponse(cards, safe=False)

def get_decks(request):
    decks = Card.objects.values_list('deck', flat=True).distinct()
    return JsonResponse(list(decks), safe=False)


def get_cards_by_deck(request, deck_name):
    try:
        cards = list(Card.objects.filter(deck=deck_name).values())
        return JsonResponse(cards, safe=False)
    except Card.DoesNotExist:
        return JsonResponse({'error': 'No cards found for this deck'}, status=404)

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email)
        user.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

logger = logging.getLogger(__name__)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        logger.info(f"Login attempt for user: {username}")

        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            logger.info(f"User authenticated: {username}")
            return Response({'token': token.key, 'is_admin': user.is_staff}, status=status.HTTP_200_OK)
        else:
            logger.warning(f"Failed login attempt for user: {username}")
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)



