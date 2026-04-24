# Touch grass
## For installing the project followed the guide on `/backend` and `/frontend` file readme.md
## Overview
Touch Grass is an environmental monitoring project that evaluates the livability of a district and compare to the livabilty of your current place. By collecting real-time environmental data using a KidBright IoT board and sensors. The system measures factors such as temperature, air quality, dust concentration, carbon monoxide levels, and noise pollution. These measurements of a Livability Index that indicates which area between your current place and your district are more comfortable and healthy.


## Primary data sources
- Dust sensor (PMS7003) – measures particulate matter to evaluate air pollution.
- CO sensor (MQ-9) – detect carbon monoxide levels.
- temperature sensor(ky015) - measure temperature and humidity.

## Secondary data sources
- AQICN API – provide regional air quality data. [https://aqicn.org/api/](https://aqicn.org/api/)
- Open Weather API - provide information such as temperature and humidity [https://openweathermap.org/api](https://openweathermap.org/api)

## API to be provided
- “How livable is my current area right now?”
Returns the Livability Index score calculated from temperature, air quality, noise level, and CO concentration.

- “Which environmental factor is affecting livability the most right now?”
Provides a breakdown of factors (dust, noise, gas, temperature) contributing to the livability score.

- “Is the environment currently safe for outdoor activities?”
Combines PM2.5, CO levels, temperature, and noise to determine whether conditions are safe, moderate, or unhealthy.


- “Is the air quality in this area better or worse than the city average?”
Compares local sensor data with city-level AQI data from the AQICN API.

- “What environmental conditions are expected in the next few hours?”
Uses weather API data and recent sensor trends to estimate short-term environmental conditions.

## Sensor Modules
- 1x PMS7003
- 1x MQ-9
- 1x KY-015

## Refferrence
For all the images, credit will be given on the `/public` readme.
