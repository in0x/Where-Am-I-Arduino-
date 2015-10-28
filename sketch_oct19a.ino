#include <TinyGPS++.h>
#include <SoftwareSerial.h>
/*
 This example uses software serial and the TinyGPS++ library by Mikal Hart
 Based on TinyGPSPlus/DeviceExample.ino by Mikal Hart
 Modified by acavis
*/

// Choose two Arduino pins to use for software serial
// The GPS Shield uses D2 and D3 by default when in DLINE mode
int RXPin = 2;
int TXPin = 3;
int button = 2;

// The Skytaq EM-506 GPS module included in the GPS Shield Kit
// uses 4800 baud by default
int GPSBaud = 4800;

// Create a TinyGPS++ object called "gps"
TinyGPSPlus gps;

// Create a software serial port called "gpsSerial"
SoftwareSerial gpsSerial(RXPin, TXPin);


void setup()
{
  // Start the Arduino hardware serial port at 9600 baud
  Serial.begin(9600);
  // Start the software serial port at the GPS's default baud
  gpsSerial.begin(GPSBaud);
  pinMode(button, INPUT);
}

void loop()
{
  // This sketch displays information every time a new sentence is correctly encoded.

  int buttonValue = digitalRead(button);
  if (buttonValue == 0) {
    if (gps.encode(gpsSerial.read()))
        displayInfo();
  }
}

void displayInfo()
{
    if (gps.location.isValid())
    {
      Serial.print("Lat ");
      Serial.print(gps.location.lat());
      Serial.println();
      Serial.print("Lng ");
      Serial.print(gps.location.lng());
      Serial.println();
    } else
    {
      //default Louvre
      Serial.println("Lat 48.860294");
      Serial.println("Lng 2.338629");
    }

}

