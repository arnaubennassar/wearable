import React, { Component } from 'react'
import { NavigationActions } from 'react-navigation';
import {
//  Platform,
//  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Modal,
  ActivityIndicator,
  Image
} from 'react-native'

//import Toast from '@remobile/react-native-toast'
import BluetoothSerial from 'react-native-bluetooth-serial'
//import { recieveBT } from '../buissLogic/blue'
//import { Buffer } from 'buffer'
//global.Buffer = Buffer
//const iconv = require('iconv-lite')
// export function enable (handler) {
//     BluetoothSerial.enable()
//     .then((res) => handler() )
//     .catch((err) => console.log(err.message))
// }

// export function disable () {
//   BluetoothSerial.disable()
//   .then((res) => console.log(res) )
//   .catch((err) => console.log(err.message))
// }

export function subscribe(getData, connectionLost, disabled){
  // Promise.all([
  //     BluetoothSerial.isEnabled(),
  //     BluetoothSerial.list()
  //   ])
  //   .then((values) => {
  //     console.log('mec')
  //   })
  BluetoothSerial.subscribe('\r\n').then(  (data) => { console.log('subscribed BT') }  ) //trololoooo
  BluetoothSerial.on( 'data', (data) => { getData(data) } );
  BluetoothSerial.on( 'connectionLost', () => { connectionLost() } );
  BluetoothSerial.on('bluetoothDisabled', () => {  disabled()  }  )
}

export function enable(handler){
    BluetoothSerial.enable()
    .then((res) =>  {
      handler(true);
    } )
    .catch((err) => handler(false) )
}

export function connect(handler){
    BluetoothSerial.connect('30:15:01:07:24:05')
    .then((res) => {
      handler(true);
    })
    .catch((err) => handler(false) )
 

  //ACTION: CONECTING
  // BluetoothSerial.requestEnable()
  //   .then((resp) => {
  //     console.log('connecting')
  //     console.log(resp)
  //     // BluetoothSerial.connect('30:15:01:07:24:05')
  //     // .then((res) => {
  //     //   console.log('connected')
  //     //   this.write(() => {}, 'o');
  //     //   handler(true);
  //     // })
  //   })
  //   .catch((err) => {  
  //     console.log(err);
  //     handler(false);  
  //   })
}

// export function disconnect(){
//     BluetoothSerial.disconnect()
//       .then(() => console.log('tro'))
//       .catch((err) => console.log(err.message))
// }

export function write (handler, message) {
  BluetoothSerial.write(message)
  .then((res) => {
  })
  .catch((err) => fail())
}






var actions;
export class BTScreen extends Component {
  enable () {
    this.statusText = 'Tap to connect.';
    BluetoothSerial.requestEnable()
    .then((res) => this.enabled() )
    .catch((err) => console.log(err.message))
  }
  connect(){
    this.statusText = 'Connecting ...';
    this.actions.connecting();
    BluetoothSerial.connect('30:15:01:07:24:05')
      .then((res) => {
        //ACTION: BT CONNECTED
      //  this.write('o');
        this.connected(true);
      })
      .catch((err) => {  
        this.connected(false);  
      })
    this.forceUpdate()
  }
  write (message) {
    BluetoothSerial.write(message)
    .then((res) => {
      console.log('Successfuly wrote to device this: ')
      console.log(message)
    })
    .catch((err) => console.log(err))
  }
  componentWillMount () {
    if (this.props.navigation !== undefined){
      const setParamsAction = NavigationActions.setParams({
        params: { hideTabBar: true },
        key: 'ProfileStack',
      });
      this.props.navigation.dispatch(setParamsAction);

      this.actions = this.props.navigation.state.params.actions;
    }
    else{
      this.actions = this.props.actions;
    }
    this.enable()
  }
  enabled(){
  //  this.connect();
    this.actions.enabled();
  }
  connected(success){
    if(success){
      this.statusText = 'CONNECTED'
      this.actions.connected(  Date.parse(new Date())  )
    }
    else{
      this.statusText = 'Fail. Tap to try again'
    //  this.connect(this.connected)
      this.actions.desconnected();
    }
    this.forceUpdate()
  }
  















  render() {
      return (
        <Image style={styles.container} source={this.statusText == 'Connecting ...' ? back : oka}>
          <View style={styles.text1}>
            <Text style={styles.t1}>1. Turn on your Bluetooth.</Text>
            <Text style={styles.t2}>2. Pair it with HC-06.</Text>
          </View>
          {wearable}
          {this.statusText !== 'Connecting ...' ? 
            <TouchableOpacity style={styles.retryTouch} onPress={ () => {this.connect()} } >
              <Text style={styles.statusText}>{this.statusText}</Text>
            </TouchableOpacity>
            :
            <Text style={styles.t3}>{this.statusText}</Text> 
          }
        </Image>
      )

        //       <Text style={styles.statusText}>{this.statusText}</Text>

        
          //{wearable}
          //

        //   {this.statusText !== 'Connecting ...' ? (
            
        // ) : <Text style={styles.t3}>{this.statusText}</Text> }

        //   {
        //     this.props.navigation === undefined ? (
        //     <TouchableOpacity
        //       style={styles.skipTouch}
        //       hitSlop={{ top: 5, bottom: 15, left: 15, right: 15 }}
        //       onPress={ () => {this.actions.skip()} }
        //     >
        //       <Text style={styles.skipText}>Skip this step for now</Text>
        //     </TouchableOpacity>
        // ) : null }
      
    }
}
const hait = Dimensions.get('window').height;
const wiz = Dimensions.get('window').width;
const wearable = (<Image style={{position: 'absolute', resizeMode:'stretch', alignSelf: 'center', marginTop:hait*0.22, height:hait*0.4, width:hait*0.4*0.7}} source={require("../resources/images/smartwatch.png")}></Image>)
const back = require("../resources/images/loadBT.gif");
const oka = require("../resources/images/backup.png");
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignSelf: "stretch",
    width: undefined,
    height: undefined,
    resizeMode: "cover"
  },container: {
    width: '100%',
    height: '100%',
    backgroundColor:'white'
  },
  text1: {
    position: 'absolute',
    marginTop: '8%',
    width: '100%',
    height: '10%',
  },
  t1: {
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: hait*0.02
  },
  t2: {
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: hait*0.02
  },
  t3: {
    position: 'absolute',
    width: '100%',
    height: hait*0.1,
    marginTop: hait*0.73,
    textDecorationLine: "none",
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: hait*0.022,
  },
  retryTouch: {
    position: 'absolute',
    width: '100%',
    height: hait*0.1,
    marginTop: hait*0.73,
  },
  statusText: {
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: hait*0.022
  },  
  skipText: {
    position: 'absolute',
    marginTop: '80%',
    width: '40%',
    backgroundColor: 'green',
    alignSelf: 'center',
    height: 1
  },
  skipTouch: { marginTop: 9, marginBottom: 50, marginLeft: 90, marginRight: 90 }
});
