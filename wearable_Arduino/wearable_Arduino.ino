//#include <SoftwareSerial.h>
//SoftwareSerial bluetooth(2, 3); // RX, TX
                          //LIBRARIES
#define bluetooth Serial1
//#include <Wire.h>
#include <DateTime.h>
#include <GY80.h>
#include "MAX30100_PulseOximeter.h"
                  //SENSORS
int ledPin = 6;
int tmpPin = 45;
char val;
GY80 IMUSensor = GY80();
PulseOximeter HeartSensor;
                            //DATA STRUCTURES
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

const int activityOriginalSampleRate = 1;
const int heartOriginalSampleRate = 1;
const int temperatureOriginalSampleRate = 1;                                //DATA ARRAYS
int activitySampleRate = activityOriginalSampleRate;
int heartSampleRate = heartOriginalSampleRate;
int temperatureSampleRate = temperatureOriginalSampleRate;
int activitySampleRateIndex = 0;
int heartSampleRateIndex = 0;
int temperatureSampleRateIndex = 0;
                                      
const int activitySamplesLength = 10;
const int heartSamplesLength = 10;
const int temperatureSamplesLength = 10;
temperatureSample temperatureSamples[temperatureSamplesLength];
heartSample heartSamples[heartSamplesLength];
activitySample activitySamples[activitySamplesLength];
int indexActivity = 0;
int indexHeart = 0;
int indexTemperature = 0;

const int activityBufferLength = 2;
const int heartBufferLength = 2;
const int temperatureBufferLength = 2;
temperatureSample temperatureBuffer[temperatureBufferLength];
heartSample heartBuffer[heartBufferLength];
activitySample activityBuffer[activityBufferLength];
int indexBufferActivity = 0;
int indexBufferHeart = 0;
int indexBufferTemperature = 0;


bool sendingDataRequestACK = true;
              //SETUP
void setup() {
  Serial.write("BOOT");
  DateTime.sync(0000000000L);  // default start, Jan 1, 2010
  Serial.begin(9600);
//  pinMode(ledPin, OUTPUT); // for LED status
//  pinMode(tmpPin, INPUT); // for temperature sensor
  bluetooth.begin(9600);
  if (!HeartSensor.begin()) {
      Serial.println("FAILED");
      for(;;);
  } else {
      Serial.println("SUCCESS");
  }
  IMUSensor = GY80();
  IMUSensor.begin();
}
              //LOOP
void loop() {
  delay(500);
//RECIEVE FROM BLUETOOTH
  listenBT();
//TEMPERATURE SENSOR
  readTemperatureSensor();
//IMU SENSOR
  readIMUSensor();
//HEART SENSOR
  readHeartSensor();
//SEND BLUETOOTH    
  if (indexActivity > activitySamplesLength/2 || indexHeart > heartSamplesLength/2 || indexTemperature > temperatureSamplesLength/2  ){
    Serial.println("data ready");
    if (sendingDataRequestACK == true){
      requestSendBT();
    }
    else {
      sendBT();
    }
  }
  else {
    Serial.println("  data NOT ready");
    Serial.print("  indexTemperature = ");
    Serial.println(indexTemperature);
  }
}  

                        //READ SENSORS   
//HEART
void readHeartSensor(){
  if (indexBufferHeart == heartBufferLength){
    indexBufferHeart = 0;
    
    //SAMPLES IS FULL
    if (indexHeart == heartSamplesLength){
      Serial.println("--COMPRESSING DATAAAAAAAAAAAAAAAAAAAAAAA");
      //compress SAMPLES data
      int steps = 0;
      for (int i = 0; i < heartSamplesLength; i += 2){
        heartSamples[i - steps].heart = ((heartSamples[i + 1].heart + heartSamples[i].heart)/2);
        heartSamples[i - steps].timeStamp = heartSamples[i].timeStamp + ((heartSamples[i + 1].timeStamp - heartSamples[i].timeStamp)/2);
        ++steps;
      }
      indexHeart = heartSamplesLength/2;
      heartSampleRate *= 2;
    }
    
    //add data BUFFER => SAMPLES
    float sum = 0;
    for (int i = 0; i < heartBufferLength; ++i){
      sum += heartBuffer[i].heart;
    }
    heartSamples[indexHeart].heart = sum / (float)heartBufferLength;
    heartSamples[indexHeart].timeStamp = heartBuffer[0].timeStamp + ((heartBuffer[heartBufferLength - 1].timeStamp - heartBuffer[0].timeStamp)/2);
    ++ indexHeart;
  }
  if (heartSampleRateIndex == heartSampleRate){
    HeartSensor.update();
    heartSampleRateIndex = 0;
    heartBuffer[indexBufferHeart].timeStamp = DateTime.now();
    heartBuffer[indexBufferHeart].heart = HeartSensor.getHeartRate();
    ++indexBufferHeart;
  }
  else {
    ++heartSampleRateIndex;
  }
}

//ACTIVITY
void readIMUSensor(){
  //BUFFER IS FULL
  if (indexBufferActivity == activityBufferLength){
    indexBufferActivity = 0;
    //SAMPLES IS FULL
    if (indexActivity == activitySamplesLength){
      Serial.println("--COMPRESSING DATAAAAAAAAAAAAAAAAAAAAAAA");
      //compress SAMPLES data
      int steps = 0;
      for (int i = 0; i < activitySamplesLength; i += 2){
        time_t aux = activitySamples[i].timeStamp + ((activitySamples[i + 1].timeStamp - activitySamples[i].timeStamp)/2);
        activitySamples[i - steps] = sumActivitySamples(false, activitySamples[i + 1], activitySamples[i], aux);
        ++steps;
      }
      indexActivity = activitySamplesLength/2;
      activitySampleRate *= 2;
    }
    activitySample sum = {0,0,0,0,0,0, DateTime.now()};
    time_t timeStampActivity = activityBuffer[0].timeStamp + ((activityBuffer[activityBufferLength - 1].timeStamp - activityBuffer[0].timeStamp)/2);
    for (int i = 0; i < activityBufferLength; ++i){
      sum = sumActivitySamples(false, sum, activityBuffer[i], timeStampActivity);
    }
    activitySamples[indexActivity] = sum;
    ++ indexActivity;
  }
  //SAMPLE RATE
  if (activitySampleRateIndex == activitySampleRate){
    //READ DATA
    activitySampleRateIndex = 0;
    GY80_scaled IMUValues = IMUSensor.read_scaled();
    activityBuffer[indexBufferActivity] = {
      abs(IMUValues.g_x),
      abs(IMUValues.g_y),
      abs(IMUValues.g_x),
      abs(IMUValues.a_x),
      abs(IMUValues.a_y),
      abs(IMUValues.a_x),
      DateTime.now(),
    };
    ++indexBufferActivity;
  }
  else {
    ++activitySampleRateIndex;
  }
}

activitySample sumActivitySamples (bool sub, activitySample a, activitySample b, time_t clk){
  if (sub){
    b.accX *= -1;
    b.accY *= -1;
    b.accZ *= -1;
    b.gyroX *= -1;
    b.gyroY *= -1;
    b.gyroZ *= -1;
  }
  activitySample r = {
    a.accX + b.accX ,
    a.accY + b.accY ,
    a.accZ + b.accZ ,
    a.gyroX + b.gyroX ,
    a.gyroY + b.gyroY ,
    a.gyroZ + b.gyroZ ,
    clk
  };
  return r;
}

//TEMPERATURE
void readTemperatureSensor(){
    //BUFFER IS FULL
  if (indexBufferTemperature == temperatureBufferLength){
    indexBufferTemperature = 0;
    //SAMPLES IS FULL
    if (indexTemperature == temperatureSamplesLength){
      int steps = 0;
      for (int i = 0; i < temperatureSamplesLength; i += 2){
        temperatureSamples[i - steps].temperature = (temperatureSamples[i + 1].temperature + temperatureSamples[i].temperature)/2;
        temperatureSamples[i - steps].timeStamp = temperatureSamples[i].timeStamp + ((temperatureSamples[i + 1].timeStamp - temperatureSamples[i].timeStamp)/2);
        ++steps;
      }
      indexTemperature = temperatureSamplesLength/2;
      temperatureSampleRate *= 2;
    }
    
    //add data BUFFER => SAMPLES
    float sum = 0;
    for (int i = 0; i < temperatureBufferLength; ++i){
      sum += temperatureBuffer[i].temperature;
    }
    temperatureSamples[indexTemperature].temperature = sum / (float)temperatureBufferLength;
    temperatureSamples[indexTemperature].timeStamp = temperatureBuffer[0].timeStamp + ((temperatureBuffer[temperatureBufferLength - 1].timeStamp - temperatureBuffer[0].timeStamp)/2);
     ++ indexTemperature;
  }
  if (temperatureSampleRateIndex == temperatureSampleRate){
    temperatureSampleRateIndex = 0;
    temperatureBuffer[indexBufferTemperature].timeStamp = DateTime.now();
    temperatureBuffer[indexBufferTemperature].temperature = (5.0 * analogRead(tmpPin) * 100.0) / 1024;
    ++indexBufferTemperature;
  }
  else {
    ++temperatureSampleRateIndex;
  }
}

                //GET BLUETOOTH
void listenBT(){
  ////BT
  if( bluetooth.available() > 0 )       
  {
    val = bluetooth.read();
    Serial.println(val);
    if(!sendingDataRequestACK){
      Serial.println("current state => send DATA");
    }else {
      Serial.println("current state => send ACK");
    }
    
    if ( val == 'N' ){
      Serial.println("sync time");
      DateTime.sync(0000000000L);
    }
    if( val == '@' ){/////REQ ACK recieved
      Serial.print("REQ ACK");
      sendingDataRequestACK = !sendingDataRequestACK;
      if(!sendingDataRequestACK){
        Serial.println(", next state => send DATA");
      }else {
        Serial.println(", next state => send ACK");
      }
    }    
    if ( val == 'B'){/////DATA ACK recieved
      if(!sendingDataRequestACK){
        Serial.println("DATA ACK, next state => waiting data to be ready => send ACK");
        sendingDataRequestACK = true;
        indexActivity = 0;
        indexHeart = 0;
        indexTemperature = 0;
        activitySampleRate = activityOriginalSampleRate;
        heartSampleRate = heartOriginalSampleRate;
        temperatureSampleRate = temperatureOriginalSampleRate;
      }
    }
    val = '0'; 
  }
}

                //SEND BLUETOOTH
void requestSendBT(){
  bluetooth.println( 'r' );
}
void sendBT (){
  Serial.println("sending data");
  bluetooth.print( "{\"t\":[" );
  sendTemperature();
  bluetooth.print( "],\"h\":[" );
  sendHeart();
  bluetooth.print( "],\"a\":[" );
  sendActivity();
  bluetooth.print( "]" );
  bluetooth.println( "}" );
//  Serial.println("sent");

}
void sendTemperature (){
  for (int i = 0; i < indexTemperature; ++i){
    bluetooth.print( "{\"v\":" );
    bluetooth.print( temperatureSamples[i].temperature );
    bluetooth.print( ",\"c\":" );
    bluetooth.print( temperatureSamples[i].timeStamp );
    bluetooth.print( "}" );
    if(i < indexTemperature - 1) {
      bluetooth.print( "," );
    }
  }
}
void sendHeart (){
  for (int i = 0; i < indexHeart; ++i){
    bluetooth.print( "{\"v\":" );
    bluetooth.print( heartSamples[i].heart );
    bluetooth.print( ",\"c\":" );
    bluetooth.print( heartSamples[i].timeStamp );
    bluetooth.print( "}" );
    if(i < indexHeart - 1) {
      bluetooth.print( "," );
    }
  }
}
void sendActivity (){
  for (int i = 0; i < indexActivity; ++i){
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
    if(i < indexActivity - 1) {
      bluetooth.print( "," );
    }
  }
}



             

