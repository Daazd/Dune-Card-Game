from django.db import models
from django.contrib.auth.models import User
import pickle
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
    
class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=64)
    table_name = models.CharField(max_length=64)
    record_id = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    
class DatabaseActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log database access
        if request.user.is_authenticated:
            AuditLog.objects.create(
                user=request.user,
                action='READ',
                ip_address=request.META.get('REMOTE_ADDR')
            )
        return self.get_response(request)
    
class LoginAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    timestamp = models.DateTimeField()
    username = models.CharField(max_length=150)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField()
    time_taken = models.FloatField()
    keyboard_pattern = models.TextField(null=True)
    typing_speed = models.FloatField(default=0.0)
    backspace_rate = models.FloatField(default=0.0)
    special_char_rate = models.FloatField(default=0.0)
    pause_frequency = models.FloatField(default=0.0)
    suspicious_score = models.FloatField(default=0.0)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.username} - {self.timestamp}"

class SecurityModel(models.Model):
    last_trained = models.DateTimeField(auto_now=True)
    model_binary = models.BinaryField()

    def save(self, *args, **kwargs):
        # Custom save method for SecurityModel
        super().save(*args, **kwargs)

    @classmethod
    def get_model(cls):
        model_instance = cls.objects.first()
        if model_instance:
            return pickle.loads(model_instance.model_binary)
        return None

    @classmethod
    def save_model(cls, model):
        model_binary = pickle.dumps(model)
        cls.objects.all().delete()  # Keep only one model
        cls.objects.create(model_binary=model_binary)














