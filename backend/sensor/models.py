from django.db import models

class Sensor(models.Model):
    pm2_5 = models.FloatField(blank=True, null=True)
    pm10 = models.FloatField(blank=True, null=True)
    temp = models.FloatField(blank=True, null=True)
    humidity = models.FloatField(blank=True, null=True)
    co = models.FloatField(blank=True, null=True)
    ts = models.DateTimeField(auto_now_add=True)

# Create your models here.
class Meta:
        db_table = "sensor"
        
def __str__(self):
    return f"sensor"