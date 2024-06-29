from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CardViewSet, DeckViewSet
from . import views

router = DefaultRouter()
router.register(r'cards', CardViewSet)
router.register(r'decks', DeckViewSet)

urlpatterns = [
    path('', views.index, name='index'),
]