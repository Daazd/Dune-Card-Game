from django.contrib import admin

from django.contrib import admin
from .models import Card, Deck

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ['name', 'deck', 'set', 'rarity', 'cost', 'allegiance', 'type', 'command', 'resistance', 'artist', 'image_file']
@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    list_display = ('id',)
