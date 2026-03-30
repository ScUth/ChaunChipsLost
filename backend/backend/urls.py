"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from aqicn_api.views import latest_aqicn
from open_weather_api.views import latest_weather
from sensor.views import latest_sensor 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/aqicn/latest/', latest_aqicn, name='latest_aqicn'),
    path('api/weather/latest/', latest_weather, name='latest_weather'), 
    path('sensor/latest/', latest_sensor, name='latest_sensor'),
]
