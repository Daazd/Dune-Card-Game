from django.db import models

class Deck(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Card(models.Model):
    name = models.CharField(max_length=255, db_column='Name')
    errata = models.TextField(null=True, blank=True, db_column='Errata, Clarification, and Misprint Notes')
    set = models.CharField(max_length=255, db_column='Set')
    rarity = models.CharField(max_length=255, db_column='Rarity')
    deck = models.CharField(max_length=255, db_column='Deck')
    cost = models.CharField(max_length=255, db_column='Cost')
    allegiance = models.CharField(max_length=255, db_column='Allegiance')
    talent_req = models.CharField(max_length=255, db_column='Talent Req')
    type = models.CharField(max_length=255, db_column='Type')
    subtype1 = models.CharField(max_length=255, null=True, blank=True, db_column='Subtype 1')
    subtype2 = models.CharField(max_length=255, null=True, blank=True, db_column='Subtype 2')
    subtype3 = models.CharField(max_length=255, null=True, blank=True, db_column='Subtype 3')
    subtype4 = models.CharField(max_length=255, null=True, blank=True, db_column='Subtype 4')
    talent1 = models.CharField(max_length=255, null=True, blank=True, db_column='Talent 1')
    talent2 = models.CharField(max_length=255, null=True, blank=True, db_column='Talent 2')
    talent3 = models.CharField(max_length=255, null=True, blank=True, db_column='Talent 3')
    command = models.CharField(max_length=255, db_column='Command')
    resistance = models.CharField(max_length=255, db_column='Resistance')
    operation_text = models.TextField(null=True, blank=True, db_column='Operation Text')
    flavor_text = models.TextField(null=True, blank=True, db_column='Flavor Text')
    artist = models.CharField(max_length=255, db_column='Artist')
    image_file = models.ImageField(upload_to='dune_card_images/', blank=True, null=True)
    attack = models.IntegerField(default=0)
    defense = models.IntegerField(default=0)


    class Meta:
        db_table = 'cards2'  # Specify custom table name
        
    def save(self, *args, **kwargs):
        if self.image_file:
            self.image_file.name = self.image_file.name.split('/')[-1]
        super(Card, self).save(*args, **kwargs)

    def __str__(self):
        return self.name














