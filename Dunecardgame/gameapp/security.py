from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from gameapp.models import LoginAttempt, SecurityModel
import numpy as np
from sklearn.ensemble import IsolationForest
import pickle
import logging

logger = logging.getLogger(__name__)

class LoginSecurityService:
    @staticmethod
    def extract_features(login_attempt):
        if login_attempt.timestamp is None:
            raise ValueError("login_attempt.timestamp is None")
        # Convert login attempt data into features for ML model
        hour = login_attempt.timestamp.hour
        weekday = login_attempt.timestamp.weekday()
        time_taken = login_attempt.time_taken
        
        # Get historical data for this username
        recent_attempts = LoginAttempt.objects.filter(
            username=login_attempt.username,
            timestamp__gte=timezone.now() - timezone.timedelta(days=7)
        )
        
        failure_rate = recent_attempts.filter(success=False).count() / max(recent_attempts.count(), 1)
        attempt_frequency = recent_attempts.count() / 7.0  # Average attempts per day
        
        return np.array([[
            hour / 24.0,  # Normalize hour
            weekday / 7.0,  # Normalize weekday
            time_taken,
            failure_rate,
            attempt_frequency
        ]])

    @staticmethod
    def detect_anomaly(login_attempt):
        model = SecurityModel.get_model()
        
        if not model:
            # Lower contamination for less sensitivity
            model = IsolationForest(contamination=0.2, random_state=42)
            SecurityModel.save_model(model)
        
        features = LoginSecurityService.extract_features(login_attempt)
        score = model.predict(features)[0]
        
        # Adjust normalization to be more permissive
        return max(0, (1 - score) / 2.5)

    @staticmethod
    def should_block_attempt(login_attempt):
        try:
            # Increase time window and attempts threshold
            recent_attempts = LoginAttempt.objects.filter(
                username=login_attempt.username,
                timestamp__gte=timezone.now() - timezone.timedelta(minutes=15),
                success=False
            ).count()
    
            logger.debug(f"Found {recent_attempts} recent failed attempts for {login_attempt.username}")
    
            # More lenient attempt threshold
            if recent_attempts >= 10:
                logger.warning(f"Blocking access: too many failed attempts ({recent_attempts})")
                return True
    
            anomaly_score = LoginSecurityService.detect_anomaly(login_attempt)
            logger.debug(f"Anomaly score for {login_attempt.username}: {anomaly_score}")
            
            # Much higher threshold for anomaly blocking
            if anomaly_score > 0.98:
                logger.warning(f"Blocking access: high anomaly score ({anomaly_score})")
                return True
    
            return False
            
        except Exception as e:
            logger.error(f"Error in should_block_attempt: {str(e)}")
            return False
