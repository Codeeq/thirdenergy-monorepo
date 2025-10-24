/*/firmware for ThirdEnergy of smart iot micro- station BY Hammed Quyum  sept 2025(C)/*/


#include <WiFi.h>
#include <HTTPClient.h>
#include <PZEM004Tv30.h>
#include <time.h>

// ==== WiFi credentials ====
const char* ssid = "******";
const char* password = "*******";

// ==== Firebase Realtime Database URLs ====
const char* dataURL    = "https://*********-id-default-rtdb.firebaseio.com/pzem.json";
const char* logsURL    = "https://***************-id-default-rtdb.firebaseio.com/logs.json";
const char* limitURL   = "https://***************-id-default-rtdb.firebaseio.com/energy_limit.json";
const char* controlURL = "https://**************-id-default-rtdb.firebaseio.com/relay_control.json";

#define RELAY_PIN *    

PZEM004Tv30 pzem(&Serial2, *, *);

bool relayState = true;      // relay ON by default
long energyLimit = 0;        // in Wh, loaded from Firebase
long lastEnergyLimit = -1;   // to detect recharge from Firebase


void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); 

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");

  // NTP for timestamps
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
}

///////////////////////////// Get Timestamp ////////////////////////////////////////
String getTimestamp() {
  time_t now;
  time(&now);
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);

  char buf[25];
  strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(buf);
}

////////////////////////////////////Log Event to Firebase/////////////////////////////////////////////
void logEvent(String message) {
  String logData = "{";
  logData += "\"time\":\"" + getTimestamp() + "\",";
  logData += "\"event\":\"" + message + "\"";
  logData += "}";

  HTTPClient http;
  http.begin(logsURL);
  http.addHeader("Content-Type", "application/json");
  http.POST(logData);
  http.end();

  Serial.println("LOG: " + message);
}


void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // --- Step 1: Get Energy Limit from Firebase ---
    HTTPClient httpLimit;
    httpLimit.begin(limitURL);
    int code = httpLimit.GET();
    if (code == 200) {
      String payload = httpLimit.getString();
      payload.trim();
      long newLimit = payload.toInt(); // limit in Wh
      if (newLimit != lastEnergyLimit && newLimit > 0) {
        // New recharge detected
        energyLimit = newLimit;
        lastEnergyLimit = newLimit;
        pzem.resetEnergy(); // reset counter
        relayState = true;  // turn supply back ON
        logEvent("New recharge: " + String(energyLimit) + " Wh");
      }
    }
    httpLimit.end();

    ///////////////////////////Check relay control from Firebase (manual override)///////////////////////
    HTTPClient httpRelay;
    httpRelay.begin(controlURL);
    int rcCode = httpRelay.GET();
    if (rcCode == 200) {
      String rcPayload = httpRelay.getString();
      rcPayload.trim();
      if (rcPayload == "\"OFF\"") {
        relayState = false;
        logEvent("Relay forced OFF from Firebase");
      } else if (rcPayload == "\"ON\"") {
        relayState = true;
        logEvent("Relay forced ON from Firebase");
      }
    }
    httpRelay.end();

    // --- Step 3: Read Sensor Data ---
    float voltage = pzem.voltage();
    float current = pzem.current();
    float power   = pzem.power();
    float energy  = pzem.energy();  // Wh from PZEM
    float freq    = pzem.frequency();
    float pf      = pzem.pf();

    /////////////////////////////////////////Auto cutoff if energy limit reached//////////////////////////////////
    if (energyLimit > 0 && !isnan(energy) && energy >= energyLimit) {
      if (relayState) logEvent("Energy " + String(energy) + " Wh exceeded limit. Relay OFF");
      relayState = false;
    }

    ////////// Apply Relay State////////////////////////////////////
    digitalWrite(RELAY_PIN, relayState ? LOW : HIGH);
    // NOTE: LOW/HIGH depends on relay module. Adjust if inverted.

    ///////////////////// Upload Realtime Data ////////////////////////////////////////////
    String jsonData = "{";
    jsonData += "\"voltage\":\"" + String(voltage, 2) + " V\",";
    jsonData += "\"current\":\"" + String(current, 3) + " A\",";
    jsonData += "\"power\":\""   + String(power, 2) + " W\",";
    jsonData += "\"energy\":\""  + String(energy, 3) + " Wh\",";
    jsonData += "\"frequency\":\""+ String(freq, 2) + " Hz\",";
    jsonData += "\"pf\":\""      + String(pf, 2) + "\",";
    jsonData += "\"relay\":\""   + String(relayState ? "ON" : "OFF") + "\",";
    jsonData += "\"energy_limit\":\"" + String(energyLimit) + " Wh\"";
    jsonData += "}";

    HTTPClient httpPut;
    httpPut.begin(dataURL);
    httpPut.addHeader("Content-Type", "application/json");
    httpPut.PUT(jsonData);
    httpPut.end();

    // //// Log Snapshot///////////////////////////
    logEvent("Data: " + String(energy, 1) + "Wh used / " + String(energyLimit) + "Wh limit");
  }

  delay(5000);
}
