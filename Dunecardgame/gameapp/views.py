from django.http import JsonResponse
from rest_framework import viewsets
from .models import Card
from .serializers import CardSerializer

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




