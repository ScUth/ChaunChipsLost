from django.db import models

class OpenWeatherApi(models.Model):
    lat = models.FloatField(blank=True, null=True)
    lon = models.FloatField(blank=True, null=True)
    temp = models.FloatField(blank=True, null=True)
    humidity = models.FloatField(blank=True, null=True)
    ts = models.DateTimeField(auto_now_add=True)

    # Create your models here.
    class Meta:
            db_table = "open_weather_api"
            managed = False
            
    def __str__(self):
        return f"open_weather_api"