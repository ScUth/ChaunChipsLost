import paho.mqtt.client as mqtt
import mysql.connector
import json

# MQTT Configuration
MQTT_BROKER = "192.168.1.57"
MQTT_TOPIC = "b6710545521/sensor/data"
MQTT_USER = ""  # Add your username if required
MQTT_PASS = ""  # Add your password if required

# Database Configuration
DB_CONFIG = {
    "host": "192.168.1.57",
    "user": "tmp2",
    "password": "amogus123",
    "database": "daq_proj",
    "port": 3306
}

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    # Subscribe here to ensure it reconnects if the connection drops
    client.subscribe(MQTT_TOPIC)
    print(f"Subscribed to: {MQTT_TOPIC}")

def on_message(client, userdata, msg):
    print("--- NEW MESSAGE RECEIVED ---")
    try:
        payload = msg.payload.decode()
        data = json.loads(payload)
        print(f"Attempting to insert: {data}")

        db = mysql.connector.connect(**DB_CONFIG)
        cursor = db.cursor()
        
        # Use backticks for table names if they have spaces or special meanings
        sql = "INSERT INTO `sensor` (pm2_5, pm10, temp, humidity, co) VALUES (%s, %s, %s, %s, %s)"
        values = (data['pm2_5'], data['pm10'], data['temp'], data['humidity'], data['co'])
        
        cursor.execute(sql, values)
        db.commit()
        
        print(f"Success! {cursor.rowcount} row inserted.")
        
        cursor.close()
        db.close()
    except Exception as e:
        print(f"DATABASE ERROR: {e}")  # This will tell us the EXACT problem

# Create MQTT client
client = mqtt.Client(client_id="")
if MQTT_USER and MQTT_PASS:
    client.username_pw_set(MQTT_USER, MQTT_PASS)

client.on_connect = on_connect
client.on_message = on_message

print("Connecting to broker...")
client.connect(MQTT_BROKER, 1883, 60)

# This is CRITICAL. Without this, the script finishes and exits immediately.
client.loop_forever()