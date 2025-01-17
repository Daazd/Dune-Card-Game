import os
import django
import random
import numpy as np
from datetime import datetime, timedelta
import json
import pickle
from typing import List, Dict

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Dunecardgame.settings')
django.setup()

from django.contrib.auth.models import User
from gameapp.models import LoginAttempt, SecurityModel
from django.utils import timezone
from sklearn.ensemble import IsolationForest

class LoginPatternGenerator:
    @staticmethod
    def generate_normal_pattern() -> Dict:
        """Generate normal user typing and behavior patterns"""
        typing_speed = random.uniform(150, 300)  # Normal typing speed (ms)
        return {
            'typing_speed': typing_speed,
            'backspace_rate': random.uniform(0.05, 0.15),  # Normal error correction
            'special_char_rate': random.uniform(0.08, 0.12),
            'pause_frequency': random.uniform(0.1, 0.2),
            'time_taken': random.uniform(1.5, 4.0)  # Total login time (seconds)
        }

    @staticmethod
    def generate_suspicious_pattern() -> Dict:
        """Generate suspicious patterns (automated/bot-like behavior)"""
        typing_speed = random.uniform(20, 50)  # Suspiciously fast typing
        return {
            'typing_speed': typing_speed,
            'backspace_rate': random.uniform(0, 0.02),  # Few to no corrections
            'special_char_rate': random.uniform(0.2, 0.3),  # Unusual character usage
            'pause_frequency': random.uniform(0, 0.05),
            'time_taken': random.uniform(0.1, 0.5)  # Very quick completion
        }

    @staticmethod
    def generate_keyboard_pattern(pattern_type: str) -> List[Dict]:
        """Generate keyboard timing data"""
        sample_text = "username123"
        pattern = []
        cumulative_time = 0
        
        base_delay = 30 if pattern_type == "suspicious" else 150
        variation = 10 if pattern_type == "suspicious" else 50

        for char in sample_text:
            delay = random.uniform(base_delay - variation, base_delay + variation)
            cumulative_time += delay
            pattern.append({
                'key': char,
                'timestamp': cumulative_time
            })
        
        return pattern

class SecurityDataSeeder:
    def __init__(self):
        self.pattern_generator = LoginPatternGenerator()
        self.demo_users = [
            {'username': 'demo_user', 'is_staff': False},
            {'username': 'admin_user', 'is_staff': True},
            {'username': 'test_user', 'is_staff': False}
        ]
        self.ip_pools = {
            'normal': [f'192.168.1.{i}' for i in range(100, 200)],
            'suspicious': [f'10.0.0.{i}' for i in range(50, 100)]
        }
        self.user_agents = {
            'normal': [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
            ],
            'suspicious': [
                'Python-urllib/3.8',
                'curl/7.64.1',
                'Wget/1.20.3 (linux-gnu)'
            ]
        }

    def create_demo_users(self):
        """Create demonstration user accounts"""
        print("Creating demo users...")
        for user_data in self.demo_users:
            username = user_data['username']
            is_staff = user_data['is_staff']
            
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'is_staff': is_staff,
                    'is_superuser': is_staff
                }
            )
            
            if created:
                user.set_password('demo123')
                user.save()
                print(f"Created user: {username}")
            else:
                print(f"User already exists: {username}")

    def generate_login_attempt(self, timestamp: datetime, is_suspicious: bool) -> Dict:
        """Generate a single login attempt with specified characteristics"""
        pattern_type = "suspicious" if is_suspicious else "normal"
        username = random.choice([u['username'] for u in self.demo_users])
        
        login_data = {
            'username': username,
            'timestamp': timestamp,
            'ip_address': random.choice(self.ip_pools[pattern_type]),
            'user_agent': random.choice(self.user_agents[pattern_type]),
            'keyboard_pattern': json.dumps(
                self.pattern_generator.generate_keyboard_pattern(pattern_type)
            ),
            'success': random.random() > (0.8 if is_suspicious else 0.1),  # 20% success rate for suspicious
        }

        # Add pattern metrics
        pattern = (self.pattern_generator.generate_suspicious_pattern() if is_suspicious 
                  else self.pattern_generator.generate_normal_pattern())
        login_data.update(pattern)

        return login_data

    def create_login_history(self, days: int = 30):
        """Generate historical login attempt data"""
        print(f"Generating {days} days of login history...")
        LoginAttempt.objects.all().delete()  # Clear existing data
        
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)
        current = start_date

        attempts_created = 0
        while current <= end_date:
            # Normal business hours (8 AM - 6 PM)
            is_business_hours = 8 <= current.hour <= 18
            is_weekday = current.weekday() < 5
            
            # Generate normal login attempts during business hours
            if is_business_hours and is_weekday:
                num_attempts = random.randint(5, 15)
                for _ in range(num_attempts):
                    login_data = self.generate_login_attempt(current, is_suspicious=False)
                    LoginAttempt.objects.create(**login_data)
                    attempts_created += 1

            # Generate suspicious attempts (more likely during off-hours)
            if not is_business_hours or not is_weekday:
                if random.random() < 0.4:  # 40% chance of suspicious activity during off-hours
                    num_attempts = random.randint(20, 50)  # Burst of attempts
                    for _ in range(num_attempts):
                        login_data = self.generate_login_attempt(current, is_suspicious=True)
                        LoginAttempt.objects.create(**login_data)
                        attempts_created += 1

            current += timedelta(hours=1)

        print(f"Created {attempts_created} login attempts")

    def initialize_ml_model(self):
        """Initialize and train the anomaly detection model"""
        print("Training ML model...")
        
        # Get successful login attempts for training
        normal_attempts = LoginAttempt.objects.filter(success=True)
        
        if normal_attempts.exists():
            # Extract features
            features = np.array([
                [
                    float(attempt.timestamp.hour) / 24.0,  # Time of day
                    float(attempt.time_taken),
                    float(attempt.typing_speed),
                    float(attempt.backspace_rate),
                    float(attempt.special_char_rate)
                ]
                for attempt in normal_attempts
            ])

            # Initialize and train model
            model = IsolationForest(
                n_estimators=100,
                contamination=0.1,
                random_state=42
            )
            model.fit(features)

            # Save model
            SecurityModel.objects.all().delete()
            SecurityModel.objects.create(
                model_binary=pickle.dumps(model)
            )
            print("ML model trained and saved successfully")
        else:
            print("No training data available")

    def run(self):
        """Execute the complete seeding process"""
        print("\nStarting security data seeding process...")
        
        self.create_demo_users()
        print("\nCreating login history...")
        self.create_login_history()
        print("\nInitializing ML model...")
        self.initialize_ml_model()
        
        print("\nSeeding complete! You can now run the security demo.")

if __name__ == "__main__":
    seeder = SecurityDataSeeder()
    seeder.run()