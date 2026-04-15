from django.db import models

class SensorData(models.Model):
    pm2_5 = models.FloatField()
    pm10 = models.FloatField()
    temp = models.FloatField()
    humidity = models.FloatField()
    co = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']