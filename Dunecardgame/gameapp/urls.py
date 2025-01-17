from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from . import views
from .views import CardViewSet, RegisterView, LoginView, UserDetailView, MyTokenObtainPairView, MyTokenRefreshView, get_cards, serve_media, SimulationView, SecurityEventsView

router = DefaultRouter()
router.register(r'cards', CardViewSet)

urlpatterns = [
    path('api/cards/', get_cards, name='get_cards'),
    path('api/decks/', views.get_decks, name='get_decks'),
    path('api/decks/<str:deck_name>/cards/', views.get_cards_by_deck, name='get_cards_by_deck'),
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/user/', UserDetailView.as_view(), name='user-detail'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('debug-media/<path:path>', views.debug_media, name='debug_media'),
    path('api/security/metrics/', views.security_metrics, name='security_metrics'),
    path('api/security/monitor/', views.security_monitor, name='security_monitor'),
    path('api/security/model-stats/', views.model_stats, name='model_stats'),
    path('api/simulation/', SimulationView.as_view(), name='security-simulation'),
    path('api/events/', SecurityEventsView.as_view(), name='security-events'),
    re_path(r'^media/(?P<path>.*)$', serve_media),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

