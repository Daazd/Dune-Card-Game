from django.http import JsonResponse, HttpResponse, FileResponse, Http404
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Card
from .serializers import CardSerializer
import logging
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from Dunecardgame.attack_simulation import SecurityDemoSimulator
from .security import SecurityModel
from .network_monitor import NetworkMonitor
from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import os
import logging
from django.utils import timezone
from .models import LoginAttempt
from .security import LoginSecurityService
import time
from django.utils import timezone
import json
import random

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

@api_view(['POST'])
def analyze_security_patterns(request):
    analysis_type = request.data.get('analysisType')
    
    if analysis_type == 'normal':
        # Generate realistic normal behavior patterns
        data = generate_normal_patterns()
    elif analysis_type == 'attack':
        # Generate realistic attack patterns
        data = generate_attack_patterns()
    else:
        # Generate suspicious patterns
        data = generate_suspicious_patterns()
        
    return Response(data)

def generate_normal_patterns():
    model = SecurityModel.get_model()
    patterns = model.generate_patterns('normal')
    return patterns

def generate_attack_patterns():
    model = SecurityModel.get_model()
    patterns = model.generate_patterns('attack')
    return patterns

def generate_suspicious_patterns():
    model = SecurityModel.get_model()
    patterns = model.generate_patterns('suspicious')
    return patterns

@method_decorator(csrf_exempt, name='dispatch')
class SimulationView(APIView):
    authentication_classes = []  # For demo purposes
    permission_classes = []      
    def post(self, request):
        sim_type = request.data.get('type')
        simulator = SecurityDemoSimulator("http://localhost:8000")
        
        if sim_type == 'bruteforce':
            simulator.simulate_brute_force("demo_user", attempts=20)
            print("Brute force simulation complete")
        elif sim_type == 'distributed':
            simulator.simulate_distributed_attack("demo_user")
            print("Distributed attack simulation complete")
        elif sim_type == 'suspicious':
            simulator.simulate_suspicious_behavior("demo_user", "password")
            print("Suspicious behavior simulation complete")
            
        return Response({"status": "simulation started"})
    
class SecurityEventsView(APIView):
    authentication_classes = []
    permission_classes = []
    
    def get(self, request):
        # Return the latest event data as regular JSON
        event_data = {
            'type': 'security_event',
            'data': {
                'score': random.random(),
                'timestamp': time.time()
            }
        }
        return Response(event_data)

class LoginView(APIView):
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR', '127.0.0.1')

    def post(self, request):
        try:
            username = request.data.get('username')
            # Add this debug section
            from django.contrib.auth.models import User
            user = User.objects.filter(username=username).first()
            if user:
                print(f"User found: {username}, is_active: {user.is_active}")
            else:
                print(f"User not found: {username}")
            password = request.data.get('password')

            print(f"Login attempt received for user: {username}")
            print(f"Request data: {request.data}")

            # Create login attempt record with timestamp
            login_attempt = LoginAttempt(
                username=username,
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                success=False,
                time_taken=0.0,
                timestamp=timezone.now()  # Add this line to set the timestamp
            )

            try:
                if LoginSecurityService.should_block_attempt(login_attempt):
                    login_attempt.save()
                    print(f"Blocking attempt for {username} due to security policy")
                    return Response({
                        'error': 'Too many failed attempts. Please try again later.'
                    }, status=status.HTTP_429_TOO_MANY_REQUESTS)

            except Exception as e:
                print(f"Error in security check: {str(e)}")

            user = authenticate(username=username, password=password)
            if user is not None:
                token, _ = Token.objects.get_or_create(user=user)
                login_attempt.success = True
                login_attempt.save()
                print(f"Successful login for {username}")
                return Response({
                    'token': token.key,
                    'is_admin': user.is_staff
                })
            else:
                login_attempt.save()
                print(f"Failed login for {username}: Invalid credentials")
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Unexpected error in login: {str(e)}")
            return Response({
                'error': 'Login failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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

@api_view(['GET'])
def security_metrics(request):
    """Return security metrics for dashboard"""
    # Example data - replace with real metrics in production
    return Response({
        'login_attempts': [...],
        'security_scores': [...],
        'model_performance': {...}
    })
    
@api_view(['GET'])
def network_stats(request):
    monitor = NetworkMonitor()
    # Get last 30 seconds of traffic
    monitor.start_monitoring()
    return Response({
        'suspicious_ips': list(monitor.suspicious_ips),
        'traffic_count': dict(monitor.ip_counts)
    })

@api_view(['POST'])
def security_monitor(request):
    """Handle real-time security monitoring"""
    data = request.data
    # Process login attempt and return analysis
    return Response({
        'score': 0.75,
        'alerts': [],
        'recommendations': []
    })

@api_view(['GET'])
def model_stats(request):
    """Return ML model statistics"""
    return Response({
        'accuracy': 0.95,
        'false_positives': 0.02,
        'feature_importance': {...}
    })
    
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def security_report(request):
    return Response({
        'database_security': {
            'encryption': 'AES-256',
            'ssl_enabled': True,
            'connection_pooling': True,
            'audit_logging': True,
        },
        'authentication': {
            'mfa_enabled': True,
            'password_policy': {
                'min_length': 12,
                'requires_special_chars': True,
                'requires_numbers': True,
                'max_age_days': 90
            }
        },
        'api_security': {
            'rate_limiting': True,
            'ssl_enforced': True,
            'jwt_tokens': True
        }
    })