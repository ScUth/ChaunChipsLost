from django.db import models

class AqicnApi(models.Model):
    pm2_5 = models.FloatField(blank=True, null=True)
    pm10 = models.FloatField(blank=True, null=True)
    co = models.FloatField(blank=True, null=True)
    ts = models.DateTimeField(auto_now_add=True)

# Create your models here.
class Meta:
        db_table = "aqicn_api"
        
def __str__(self):
    return f"aqicn_api"