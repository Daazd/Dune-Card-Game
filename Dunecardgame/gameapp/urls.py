from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from . import views
from .views import CardViewSet, RegisterView, LoginView, UserDetailView

router = DefaultRouter()
router.register(r'cards', CardViewSet)

urlpatterns = [
    path('cards/', views.get_cards, name='get_cards'),
    path('decks/', views.get_decks, name='get_decks'),
    path('decks/<str:deck_name>/cards/', views.get_cards_by_deck, name='get_cards_by_deck'),
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/user/', UserDetailView.as_view(), name='user-detail'),
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

