#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <WiFi.h>
#include <BluetoothSerial.h>

// Create MPU6050 object
Adafruit_MPU6050 mpu;

// Motor control pins
#define IN1 14
#define IN2 27
#define IN3 26
#define IN4 25
#define ENA 12
#define ENB 13

// Wi-Fi credentials
const char* ssid = "No Internet Access";
const char* password = "12345678";

// Web server on port 80
WiFiServer server(80);

// Bluetooth Serial
BluetoothSerial SerialBT;

// Gesture thresholds
float forwardThreshold = 5;
float backwardThreshold = -5;
float leftThreshold = -5;
float rightThreshold = 5;

// Flag to track if IP address has been sent over Bluetooth
bool ipSentOverBluetooth = false;
int mode = 0;

// Function prototypes
void handleGestureControl();
void handleWiFiControl();
void handleBluetoothControl();
void moveForward();
void moveBackward();
void turnLeft();
void turnRight();
void stopMotors();

void setup() {
    // Initialize serial monitor
    Serial.begin(115200);

    // Initialize MPU6050
    if (!mpu.begin()) {
        Serial.println("Failed to find MPU6050 chip");
        while (1) {
            delay(10);
        }
    }
    Serial.println("MPU6050 Found!");

    // Set motor control pins as outputs
    pinMode(IN1, OUTPUT);
    pinMode(IN2, OUTPUT);
    pinMode(IN3, OUTPUT);
    pinMode(IN4, OUTPUT);
    pinMode(ENA, OUTPUT);
    pinMode(ENB, OUTPUT);

    // Set default motor speed
    analogWrite(ENA, 200); // 50% speed
    analogWrite(ENB, 200); // 50% speed

    // Connect to Wi-Fi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
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

void loop() {
  handleGestureControl();
  handleWiFiControl();
  handleBluetoothControl();
}

// Gesture control logic
void handleGestureControl() {
  if (mode == 0){
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);

    // Check for forward tilt
    if (a.acceleration.x > forwardThreshold) {
        moveForward();
        Serial.println("Tilt: Forward");
    }
    // Check for backward tilt
    else if (a.acceleration.x < backwardThreshold) {
        moveBackward();
        Serial.println("Tilt: Backward");
    }
    // Check for left tilt
    else if (a.acceleration.y < leftThreshold) {
        turnLeft();
        Serial.println("Tilt: Left");
    }
    // Check for right tilt
    else if (a.acceleration.y > rightThreshold) {
        turnRight();
        Serial.println("Tilt: Right");
    }
    // If no significant tilt, stop motors
    else {
        stopMotors();
        Serial.println("Tilt: Neutral");
    }
  }
}
/*
// Wi-Fi control logic
void handleWiFiControl() {
    WiFiClient client = server.available();
    if (client) {
        String request = client.readStringUntil('\r');
        request.trim();
        Serial.println(request);

        // Handle HTTP requests
        if (request.indexOf("/front") != -1) {
            moveForward();
        } else if (request.indexOf("/back") != -1) {
            moveBackward();
        } else if (request.indexOf("/left") != -1) {
            turnLeft();
        } else if (request.indexOf("/right") != -1) {
            turnRight();
        } else if (request.indexOf("/stop") != -1) {
            stopMotors();
        } else if (request.indexOf("/gesture_off") != -1) {
            mode=1;
        } else if (request.indexOf("/gesture_on") != -1) {
            mode=0;
        }

        // Send response to client
        client.println("HTTP/1.1 200 OK");
        client.println("Content-Type: text/html");
        client.println("");
        client.println("<html><head><style>");
        client.println("body { background-color: black; color: white; text-align: center; font-family: Arial, sans-serif; }");
        client.println("h1 { font-size: 3em; margin-top: 20px; }");
        client.println("button { background-color: #4CAF50; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 1.5em; margin: 10px; cursor: pointer; border: none; border-radius: 8px; }");
        client.println("button:hover { background-color: #45a049; }");
        client.println("</style></head><body>");
        client.println("<h1>Wheelchair Control</h1>");
        client.println("<p><a href='/gesture_off'><button>Gesture Off</button></a></p>");
        client.println("<p><a href='/gesture_on'><button>Gesture On</button></a></p>");
        client.println("<p><a href='/front'><button>Front</button></a></p>");
        client.println("<p><a href='/back'><button>Back</button></a></p>");
        client.println("<p><a href='/left'><button>Left</button></a></p>");
        client.println("<p><a href='/right'><button>Right</button></a></p>");
        client.println("<p><a href='/stop'><button>Stop</button></a></p>");
        client.println("</body></html>");
        client.stop();
    }
}
*/

void handleWiFiControl() {
    WiFiClient client = server.available();
    if (client) {
        String request = client.readStringUntil('\r');
        request.trim();
        Serial.println(request);

        // Handle HTTP requests
        if (request.indexOf("GET /front") != -1) {
            moveForward();
            sendJSONResponse(client, "Moving Forward");
        } else if (request.indexOf("GET /back") != -1) {
            moveBackward();
            sendJSONResponse(client, "Moving Backward");
        } else if (request.indexOf("GET /left") != -1) {
            turnLeft();
            sendJSONResponse(client, "Turning Left");
        } else if (request.indexOf("GET /right") != -1) {
            turnRight();
            sendJSONResponse(client, "Turning Right");
        } else if (request.indexOf("GET /stop") != -1) {
            stopMotors();
            sendJSONResponse(client, "Stopped");
        } else if (request.indexOf("GET /gesture_off") != -1) {
            mode = 1;
            sendJSONResponse(client, "Gesture Control Off");
        } else if (request.indexOf("GET /gesture_on") != -1) {
            mode = 0;
            sendJSONResponse(client, "Gesture Control On");
        } else {
            sendJSONResponse(client, "Invalid Request");
        }

        client.stop();
    }
}

// Helper function to send JSON response
void sendJSONResponse(WiFiClient &client, const String &message) {
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: application/json");
    client.println("Access-Control-Allow-Origin: *");
    client.println("Connection: close");
    client.println();
    client.println("{\"status\": \"" + message + "\"}");
    client.println();
}

// Bluetooth control logic
void handleBluetoothControl() {
    if (SerialBT.available()) {
        String command = SerialBT.readString();
        command.trim();
        Serial.println("Bluetooth Command: " + command);

        if (command == "front") {
            moveForward();
        } else if (command == "back") {
            moveBackward();
        } else if (command == "left") {
            turnLeft();
        } else if (command == "right") {
            turnRight();
        } else if (command == "stop") {
            stopMotors();
        } else if (command == "gesture_off") {
            mode =1;
        } else if (command == "gesture_on") {
            mode =0;
        }
    }

    // Check if Bluetooth is connected and IP address hasn't been sent yet
    if (SerialBT.hasClient() && !ipSentOverBluetooth) {
        String ipAddress = WiFi.localIP().toString();
        SerialBT.println("ESP32 IP Address: " + ipAddress);
        Serial.println("IP Address sent to Bluetooth terminal.");
        ipSentOverBluetooth = true;
    }
}

// Motor control functions
void moveForward() {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
}

void moveBackward() {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
}

void turnLeft() {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
}

void turnRight() {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
}

void stopMotors() {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, LOW);
}
