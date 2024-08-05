from django.http import JsonResponse, HttpResponse, FileResponse, Http404
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Card
from .serializers import CardSerializer
import logging
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
import os
import logging

logger = logging.getLogger(__name__)

class MyTokenObtainPairView(TokenObtainPairView):
    pass

class MyTokenRefreshView(TokenRefreshView):
    pass
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

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
        })

    def put(self, request):
        user = request.user
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if username:
            user.username = username
        if email:
            user.email = email
        if password:
            user.set_password(password)
        
        user.save()

        return Response({'message': 'User details updated successfully'}, status=status.HTTP_200_OK)
    
def debug_media(request, path):
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'), content_type='image/jpeg')
    else:
        return HttpResponse(f"File not found: {file_path}", status=404)

def serve_media(request, path):
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    logger.info(f"Attempting to serve file: {file_path}")
    logger.info(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
    logger.info(f"File exists: {os.path.exists(file_path)}")
    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'))
    logger.error(f"File not found: {file_path}")
    raise Http404("Media file not found")


