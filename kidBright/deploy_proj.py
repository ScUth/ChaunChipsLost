import json
from machine import Pin, ADC, UART
import dht
import time
import struct
import network
from umqtt.robust import MQTTClient
from config import (
    WIFI_SSID, WIFI_PASS,
    MQTT_BROKER, MQTT_USER, MQTT_PASS
)

# --- Constants ---
TOPIC = "b6710545521/sensor/data"

# --- Setup Network ---
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASS)

print("Connecting to WiFi...", end="")
while not wlan.isconnected():
    time.sleep(0.5)
    print(".", end="")
print("\nConnected!")

mqtt = MQTTClient(client_id="esp32_sensor_node",
                  server=MQTT_BROKER,
                  user=MQTT_USER,
                  password=MQTT_PASS)

try:
    mqtt.connect()
    print("MQTT Connected!")
except Exception as e:
    print(f"MQTT Connection failed: {e}")

# --- Initialize Sensors ---
# MQ-9 Gas Sensor
mq9_pin = ADC(Pin(35))
mq9_pin.atten(ADC.ATTN_11DB) 

# DHT11 Temperature/Humidity
dht_pin = Pin(18, Pin.IN, Pin.PULL_UP)
sensor_dht = dht.DHT11(dht_pin)

# PM2.5 Sensor (PMS5003)
uart = UART(1, baudrate=9600, tx=27, rx=26, rxbuf=512)

def get_pm_readings(data):
    """Unpacks PM2.5 and PM10 from a valid 32-byte PMS5003 packet."""
    try:
        # Standard PMS5003 'Atmospheric' indices
        values = struct.unpack('>HHH', data[10:16])
        return {
            "pm25": values[1],
            "pm10": values[2]
        }
    except Exception:
        return None

def sync_uart_packet(uart_bus):
    if uart_bus.any() < 32:
        return None
    
    while uart_bus.any() >= 32:
        byte1 = uart_bus.read(1)
        if byte1 == b'B':
            byte2 = uart_bus.read(1)
            if byte2 == b'M':
                remaining = uart_bus.read(30)
                return b'BM' + remaining
    return None

# Timing and State
last_dht_reading = 0
dht_interval = 2000 
temp, hum = None, None # Initialize as None

print("System Ready. Monitoring...")

while True:
    current_time = time.ticks_ms()
    
    # 1. Read MQ-9 (CO/Gas)
    mq9_raw = mq9_pin.read()

    # 2. Read DHT11 (Non-blocking timing)
    if time.ticks_diff(current_time, last_dht_reading) > dht_interval:
        try:
            sensor_dht.measure()
            temp = sensor_dht.temperature()
            hum = sensor_dht.humidity()
            last_dht_reading = current_time
        except OSError:
            print("DHT Error. Skipping...")

    # 3. Read PM Sensor and Publish
    packet = sync_uart_packet(uart)
    if packet:
        pm_data = get_pm_readings(packet)
        if pm_data:
            # Construct Data Payload
            # Note: Using mq9_raw as 'co' per your requested format
            payload = {
                "temp": temp,
                "pm2_5": pm_data['pm25'],
                "pm10": pm_data['pm10'],
                "co": mq9_raw,
                "humidity": hum
            }
            
            # Convert to JSON string
            msg = json.dumps(payload)
            
            try:
                mqtt.publish(TOPIC, msg)
                print(f"Published: {msg}")
            except Exception as e:
                print(f"Failed to publish: {e}")
                # Attempt to reconnect if connection lost
                try:
                    mqtt.connect()
                except:
                    pass
    
    # Keeping the loop responsive for UART
    time.sleep(3600)