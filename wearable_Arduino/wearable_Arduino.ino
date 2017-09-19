//#include <SoftwareSerial.h>
//SoftwareSerial bluetooth(2, 3); // RX, TX
#define bluetooth Serial1
//#include <Wire.h>
#include <DateTime.h>
#include <GY80.h>
#include "MAX30100_PulseOximeter.h"

int ledPin = 6;
int tmpPin = 45;
char val;
GY80 IMUSensor = GY80();
PulseOximeter HeartSensor;
struct temperatureSample {
  float temperature;
  time_t timeStamp;
};

struct heartSample {
  float heart;
  time_t timeStamp;
};

struct activitySample {
  float gyroX;
  float gyroY;
  float gyroZ;
  float accX;
  float accY;
  float accZ;
  time_t timeStamp;
};

temperatureSample temperatureSamples[150];
heartSample heartSamples[150];
activitySample activitySamples[150];
int index = 0;
time_t firstUnsyncedTimeStamp;

void setup() {
  DateTime.sync(0000000000L);  // default start, Jan 1, 2010
  
  Serial.begin(9600);
//  gyro.begin();
//  Wire.begin();
//  pinMode(ledPin, OUTPUT); // for LED status
//  pinMode(tmpPin, INPUT); // for temperature sensor
  bluetooth.begin(9600);
//  delay(200); // wait for voltage stabilize
   // place your name in here to configure the bluetooth name.
                                       // will require reboot for settings to take affect. 
//  delay(3000); // wait for settings to take affect. 
//  digitalWrite(ledPin, LOW);
//  bluetooth.println("INIT");
  Serial.write("INIT");

    if (!HeartSensor.begin()) {
        Serial.println("FAILED");
        for(;;);
    } else {
        Serial.println("SUCCESS");
    }
  HeartSensor.setOnBeatDetectedCallback(onBeatDetected);
  IMUSensor = GY80();
  IMUSensor.begin();
}
void onBeatDetected()
{
    Serial.println("Beat!");
}
int count = 0;
  ////TIMESTAMP
//  time_t timeStamp = DateTime.now();
////
void loop() {
  delay(5000); 
  HeartSensor.update();
//RECIEVE FROM BLUETOOTH
  listenBT();
//TEMPERATURE SENSOR
  readTemperatureSensor();
//IMU SENSOR
  readIMUSensor();
//HEART SENSOR
  readHeartSensor();
  ++index;
  ++count;
  if(count > 3){
    count = 0;
    sendBT();
  }
}     
void readHeartSensor(){
  heartSamples[index].timeStamp = DateTime.now();
  heartSamples[index].heart = HeartSensor.getHeartRate();
}
void readIMUSensor(){
  GY80_scaled IMUValues = IMUSensor.read_scaled();
  activitySamples[index] = {
    IMUValues.g_x,
    IMUValues.g_y,
    IMUValues.g_x,
    IMUValues.a_x,
    IMUValues.a_y,
    IMUValues.a_x,
    DateTime.now(),
  };
}

void listenBT(){
  ////BT
  if( bluetooth.available() > 0 )       
  {
    val = bluetooth.read();
    Serial.write(val);
//   // bluetooth.println( val );
//  }
//  if( val == '@' )            
//  {
//    digitalWrite(ledPin, HIGH);
//     Serial.write(val);  
//  } else if( val == 'B' ){ 
//    digitalWrite(ledPin, LOW); 
//     Serial.write(val);  
//  }    
    if ( val == 'N' ){
       Serial.write(val);
      DateTime.sync(0000000000L);
    }
    val = '0'; 
  }
}
void sendBT (){
  //{
  //  "t": [{
  //    v: value,
  //    c: clock
  //  }]
  //}
  bluetooth.print( "{\"t\":[" );
  sendTemperature();
  bluetooth.print( "],\"h\":[" );
  sendHeart();
  bluetooth.print( "],\"a\":[" );
  sendActivity();
  bluetooth.print( "]" );
  bluetooth.println( "}" );
//  Serial.println("sent");

//////OGT
  index = 0;    //<--- RESET INDEX ON ACK
/////////
}

void readTemperatureSensor(){
  temperatureSamples[index].timeStamp = DateTime.now();
  temperatureSamples[index].temperature = (5.0 * analogRead(tmpPin) * 100.0) / 1024;
}
void sendTemperature (){
  for (int i = 0; i < index; ++i){
    bluetooth.print( "{\"v\":" );
    bluetooth.print( temperatureSamples[i].temperature );
    bluetooth.print( ",\"c\":" );
    bluetooth.print( temperatureSamples[i].timeStamp );
    bluetooth.print( "}" );
    if(i < index - 1) {
      bluetooth.print( "," );
    }
  }
}
void sendHeart (){
  for (int i = 0; i < index; ++i){
    bluetooth.print( "{\"v\":" );
    bluetooth.print( heartSamples[i].heart );
    bluetooth.print( ",\"c\":" );
    bluetooth.print( heartSamples[i].timeStamp );
    bluetooth.print( "}" );
    if(i < index - 1) {
      bluetooth.print( "," );
    }
  }
}
void sendActivity (){
  for (int i = 0; i < index; ++i){
    bluetooth.print( "{\"aX\":" );
    bluetooth.print( activitySamples[i].accX );
    bluetooth.print( ",\"aY\":" );
    bluetooth.print( activitySamples[i].accY );
    bluetooth.print( ",\"aZ\":" );
    bluetooth.print( activitySamples[i].accZ );
    bluetooth.print( ",\"gX\":" );
    bluetooth.print( activitySamples[i].gyroX );
    bluetooth.print( ",\"gY\":" );
    bluetooth.print( activitySamples[i].gyroY );
    bluetooth.print( ",\"gZ\":" );
    bluetooth.print( activitySamples[i].gyroZ );
    bluetooth.print( ",\"c\":" );
    bluetooth.print( activitySamples[i].timeStamp );
    bluetooth.print( "}" );
    if(i < index - 1) {
      bluetooth.print( "," );
    }
  }
}



             

