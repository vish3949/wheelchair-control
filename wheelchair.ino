#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <WiFi.h>
#include <BluetoothSerial.h>

Adafruit_MPU6050 mpu;

#define IN1 14
#define IN2 27
#define IN3 26
#define IN4 25
#define ENA 12
#define ENB 13

const char *ssid = "No Internet Access";
const char *password = "12345678";

WiFiServer server(80);
BluetoothSerial SerialBT;

// Gesture thresholds
float forwardThreshold = 5;
float backwardThreshold = -5;
float leftThreshold = -5;
float rightThreshold = 5;

bool ipSentOverBluetooth = false;
int mode = 0;

void handleGestureControl();
void handleWiFiControl();
void handleBluetoothControl();
void moveForward();
void moveBackward();
void turnLeft();
void turnRight();
void stopMotors();

void setup()
{
    Serial.begin(115200);

    if (!mpu.begin())
    {
        Serial.println("Failed to find MPU6050 chip");
        while (1)
        {
            delay(10);
        }
    }
    Serial.println("MPU6050 Found!");

    pinMode(IN1, OUTPUT);
    pinMode(IN2, OUTPUT);
    pinMode(IN3, OUTPUT);
    pinMode(IN4, OUTPUT);
    pinMode(ENA, OUTPUT);
    pinMode(ENB, OUTPUT);

    analogWrite(ENA, 200);
    analogWrite(ENB, 200);

    // Connect to Wi-Fi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Connecting to Wi-Fi...");
    }
    Serial.println("Connected to Wi-Fi");
    Serial.println(WiFi.localIP());

    // Start the server
    server.begin();

    // Initialize Bluetooth
    SerialBT.begin("Wheelchair");
    Serial.println("Bluetooth Initialized");
}

void loop()
{
    handleGestureControl();
    handleWiFiControl();
    handleBluetoothControl();
}

// Gesture control logic
void handleGestureControl()
{
    if (mode == 0)
    {
        sensors_event_t a, g, temp;
        mpu.getEvent(&a, &g, &temp);

        // Check for forward tilt
        if (a.acceleration.x > forwardThreshold)
        {
            moveForward();
            Serial.println("Tilt: Forward");
        }
        // Check for backward tilt
        else if (a.acceleration.x < backwardThreshold)
        {
            moveBackward();
            Serial.println("Tilt: Backward");
        }
        // Check for left tilt
        else if (a.acceleration.y < leftThreshold)
        {
            turnLeft();
            Serial.println("Tilt: Left");
        }
        // Check for right tilt
        else if (a.acceleration.y > rightThreshold)
        {
            turnRight();
            Serial.println("Tilt: Right");
        }
        // If no significant tilt, stop motors
        else
        {
            stopMotors();
            Serial.println("Tilt: Neutral");
        }
    }
}

void handleWiFiControl()
{
    WiFiClient client = server.available();
    if (client)
    {
        String request = client.readStringUntil('\r');
        request.trim();
        Serial.println(request);

        if (request.indexOf("GET /front") != -1)
        {
            moveForward();
            sendJSONResponse(client, "Moving Forward");
        }
        else if (request.indexOf("GET /back") != -1)
        {
            moveBackward();
            sendJSONResponse(client, "Moving Backward");
        }
        else if (request.indexOf("GET /left") != -1)
        {
            turnLeft();
            sendJSONResponse(client, "Turning Left");
        }
        else if (request.indexOf("GET /right") != -1)
        {
            turnRight();
            sendJSONResponse(client, "Turning Right");
        }
        else if (request.indexOf("GET /stop") != -1)
        {
            stopMotors();
            sendJSONResponse(client, "Stopped");
        }
        else if (request.indexOf("GET /gesture_off") != -1)
        {
            mode = 1;
            stopMotors();
            sendJSONResponse(client, "Gesture Control Off");
        }
        else if (request.indexOf("GET /gesture_on") != -1)
        {
            mode = 0;
            sendJSONResponse(client, "Gesture Control On");
        }
        else
        {
            sendJSONResponse(client, "Invalid Request");
        }

        client.stop();
    }
}

void sendJSONResponse(WiFiClient &client, const String &message)
{
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: application/json");
    client.println("Access-Control-Allow-Origin: *");
    client.println("Connection: close");
    client.println();
    client.println("{\"status\": \"" + message + "\"}");
    client.println();
}

// Bluetooth control logic
void handleBluetoothControl()
{
    if (SerialBT.available())
    {
        String command = SerialBT.readString();
        command.trim();
        Serial.println("Bluetooth Command: " + command);

        if (command == "front")
        {
            moveForward();
        }
        else if (command == "back")
        {
            moveBackward();
        }
        else if (command == "left")
        {
            turnLeft();
        }
        else if (command == "right")
        {
            turnRight();
        }
        else if (command == "stop")
        {
            stopMotors();
        }
        else if (command == "gesture_off")
        {
            mode = 1;
            stopMotors();
        }
        else if (command == "gesture_on")
        {
            mode = 0;
        }
    }

    if (SerialBT.hasClient() && !ipSentOverBluetooth)
    {
        String ipAddress = WiFi.localIP().toString();
        SerialBT.println("ESP32 IP Address: " + ipAddress);
        Serial.println("IP Address sent to Bluetooth terminal.");
        ipSentOverBluetooth = true;
    }
}

// Motor control functions
void moveForward()
{
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
}

void moveBackward()
{
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
}

void turnLeft()
{
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
}

void turnRight()
{
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
}

void stopMotors()
{
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, LOW);
}
