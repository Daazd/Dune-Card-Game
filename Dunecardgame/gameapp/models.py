from django.db import models

# Create your models here.
class Card(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    power = models.IntegerField()
    toughness = models.IntegerField()

class Deck(models.Model):
    name = models.CharField(max_length=100)
    cards = models.ManyToManyField(Card)