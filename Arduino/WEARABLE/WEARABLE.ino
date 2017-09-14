//#include <SoftwareSerial.h>
//SoftwareSerial bluetooth(2, 3); // RX, TX
#define bluetooth Serial1
#include <Wire.h>
#include <DateTime.h>
//#include <GY80.h>
//GY80 gyro = GY80();

int ledPin = 6;
int tmpPin = 45;
char val;
void setup() {
  DateTime.sync(0000000000L);  // default start, Jan 1, 2010
  
  Serial.begin(9600);
//  gyro.begin();
  Wire.begin();
  pinMode(ledPin, OUTPUT); // for LED status
  pinMode(tmpPin, INPUT); // for temperature sensor
  bluetooth.begin(9600);
  delay(200); // wait for voltage stabilize
   // place your name in here to configure the bluetooth name.
                                       // will require reboot for settings to take affect. 
  delay(3000); // wait for settings to take affect. 
  digitalWrite(ledPin, LOW);
  bluetooth.println("INIT");
  Serial.write("INIT");
}


  
void loop() {
//BT
  if( bluetooth.available() > 0 )       
  {
    val = bluetooth.read();
    Serial.write(val);
   // bluetooth.println( val );
  }
  if( val == '@' )            
  {
    digitalWrite(ledPin, HIGH);
     Serial.write(val);  
  } else if( val == 'B' ){ 
    digitalWrite(ledPin, LOW); 
     Serial.write(val);  
  }    
  if ( val == 'N' ){
     Serial.write(val);
    DateTime.sync(0000000000L);
  }
  val = '0'; 
//
//TIMESTAMP
  time_t timeStamp = DateTime.now();
//
//TEMPERATURE SENSOR
  float x  = (5.0 * analogRead(tmpPin) * 100.0) / 1024;
  sendBT ('t', x, timeStamp);
  delay(5000);      

}     

void sendBT (char type, float temperature, time_t stamp){
  bluetooth.print( "{\"t\":\"" );
  bluetooth.print( type );
  bluetooth.print( "\", \"v\":" );
  bluetooth.print( temperature );
  bluetooth.print(",\"c\":");
  bluetooth.print( stamp );
  bluetooth.println( '}' );
}



             

