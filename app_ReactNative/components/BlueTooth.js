import React, { Component } from 'react'
import { NavigationActions } from 'react-navigation';
import {
//  Platform,
//  ScrollView,
  StyleSheet,
//  Switch,
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

export function connect(handler){
  //ACTION: CONECTING
  console.log('connecting')
  BluetoothSerial.connect('30:15:01:07:24:05')
    .then((res) => {
      //ACTION: BT CONNECTED
      console.log('Connected to device')
      this.write(() => {}, 'o');
      handler(true);
    })
    .catch((err) => {  
      console.log(err);
      handler(false);  
    })
}

// export function disconnect(){
//     BluetoothSerial.disconnect()
//       .then(() => console.log('tro'))
//       .catch((err) => console.log(err.message))
// }

export function write (handler, message) {
  BluetoothSerial.write(message)
  .then((res) => {
    console.log('Successfuly wrote to device this: ')
    console.log(message)
  })
  .catch((err) => fail())
}


back = require("../resources/images/B1.png");
wea = require("../resources/images/wearable.png");
var actions;
export class BTScreen extends Component {
  enable () {
    BluetoothSerial.enable()
    .then((res) => this.enabled() )
    .catch((err) => console.log(err.message))
  }
  connect(){
    this.statusText = 'Connecting ...';
    this.actions.connecting();
    BluetoothSerial.connect('30:15:01:07:24:05')
      .then((res) => {
        //ACTION: BT CONNECTED
        this.write('o');
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
    this.connect();
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
        <Image style={styles.container} source={back}>
          <Text style={styles.t1}>1. Turn on your Bluetooth.</Text>
          <Text style={styles.t2}>2. Pair it with HC-06.</Text>
          <Image style={styles.wearable} source={wea}></Image>
          {this.statusText !== 'Connecting ...' ? (
            <TouchableOpacity
              style={styles.retryTouch}
              hitSlop={{ top: 5, bottom: 15, left: 15, right: 15 }}
              onPress={ () => {this.connect()} }
            >
              <Text style={styles.skipText}>{this.statusText}</Text>
            </TouchableOpacity>
        ) : <Text style={styles.t3}>{this.statusText}</Text> }

          {this.props.navigation === undefined ? (
            <TouchableOpacity
              style={styles.skipTouch}
              hitSlop={{ top: 5, bottom: 15, left: 15, right: 15 }}
              onPress={ () => {this.actions.skip()} }
            >
              <Text style={styles.skipText}>Skip this step for now</Text>
            </TouchableOpacity>
        ) : null }
        </Image>
      )
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    width: undefined,
    height: undefined,
    resizeMode: "cover"
  },
  t1: {
    marginTop: 40,
    marginLeft: 68,
    marginRight: 68,
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: 14
  },
  t2: {
    marginLeft: 68,
    marginRight: 68,
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: 14
  },
  t3: {
    marginBottom: 50,
    marginLeft: 68,
    textDecorationLine: "none",
    marginRight: 68,
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: 14
  },
  retryTouch: {
    marginBottom: 50,
    marginLeft: 68,
    marginRight: 68
  },
  wearable: {
    marginLeft: 0,
    flex: 1,
    marginRight: 0,
    marginTop:9,
  },
  // textDetail: {
  //   marginRight: 8,
  //   fontFamily: "System",
  //   fontWeight: "100",
  //   fontSize: 14
  // },
  skipText: {
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: 14
  },
  skipTouch: { marginTop: 9, marginBottom: 50, marginLeft: 90, marginRight: 90 }
});
// export class BlueTooth extends Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       troll: false,
//       isEnabled: false,
//       discovering: false,
//       devices: [],
//       unpairedDevices: [],
//       connected: false,
//       section: 0,
//       timeStamp: ''
//     }
//   }

//   componentWillMount () {
//     Promise.all([
//       BluetoothSerial.isEnabled(),
//       BluetoothSerial.list()
//     ])
//     .then((values) => {
//       const [ isEnabled, devices ] = values
//       this.setState({ isEnabled, devices })
//     })
//     BluetoothSerial.subscribe('\r\n').then(  (data) => { console.log(data) }  ) //trololoooo
//     BluetoothSerial.on(  'data', (data) => {recieveBT(data, this.state.timeStamp)}  );
//     BluetoothSerial.on('bluetoothEnabled', () => console.log('BT enab'))
//     BluetoothSerial.on('bluetoothDisabled', () => console.log('BT disab'))
//     BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
//     BluetoothSerial.on('connectionLost', () => {
//       console.log('BT connection lost')
//       this.setState({ connected: false })
//     })
//   }

//   /**
//    * [android]
//    * request enable of bluetooth from user
//    */
//   requestEnable () {
//     BluetoothSerial.requestEnable()
//     .then((res) => this.setState({ isEnabled: true }) )
//     .catch((err) => console.log(err.message))
//   }

//   /**
//    * [android]
//    * enable bluetooth on device
//    */
//   enable () {
//     BluetoothSerial.enable()
//     .then((res) => this.setState({ isEnabled: true }) )
//     .catch((err) => console.log(err.message))
//   }

//   /**
//    * [android]
//    * disable bluetooth on device
//    */
//   disable () {
//     BluetoothSerial.disable()
//     .then((res) => this.setState({ isEnabled: false })   )
//     .catch((err) => console.log(err.message))
//   }

//   /**
//    * [android]
//    * toggle bluetooth
//    */
//   toggleBluetooth (value) {
//     if (value === true) {
//       this.enable()
//     } else {
//       this.disable()
//     }
//   }

//   /**
//    * [android]
//    * Discover unpaired devices, works only in android
//    */
//   discoverUnpaired () {
//     if (this.state.discovering) {
//       return false
//     } else {
//       this.setState({ discovering: true })
//       BluetoothSerial.discoverUnpairedDevices()
//       .then((unpairedDevices) => {
//         console.log(unpairedDevices);
//         this.setState({ unpairedDevices, discovering: false })
//       })
//       .catch((err) => console.log(err.message))
//     }
//   }

//   /**
//    * [android]
//    * Discover unpaired devices, works only in android
//    */
//   cancelDiscovery () {
//     if (this.state.discovering) {
//       BluetoothSerial.cancelDiscovery()
//       .then(() => {
//         this.setState({ discovering: false })
//       })
//       .catch((err) => console.log(err.message))
//     }
//   }

//   /**
//    * [android]
//    * Pair device
//    */
//   pairDevice (device) {
//     BluetoothSerial.pairDevice(device.id)
//     .then((paired) => {
//       if (paired) {
//         console.log(`Device ${device.name} paired successfully`)
//         const devices = this.state.devices
//         devices.push(device)
//         this.setState({ devices, unpairedDevices: this.state.unpairedDevices.filter((d) => d.id !== device.id) })
//       } else {
//         console.log(`Device ${device.name} pairing failed`)
//       }
//     })
//     .catch((err) => console.log(err.message))
//   }

//   /**
//    * Connect to bluetooth device by id                  !!!!!   TOP  !!!!!!
//    * @param  {Object} device
//    */
//   connect (device) {
//     console.log(device.id);
//     this.setState({ connecting: true })
//     BluetoothSerial.connect(device.id)
//     .then((res) => {
//       console.log(`Connected to device ${device.name}`)
//       this.setState({ device, connected: true, connecting: false })
//       this.write('o');
//       this.setState({timeStamp: Date.parse(new Date()) });
//       console.log('new date');
//       console.log( Date.parse(new Date()) );
//     })
//     .catch((err) => console.log(err.message))
//   }

//   /**
//    * Disconnect from bluetooth device
//    */
//   disconnect () {
//     BluetoothSerial.disconnect()
//     .then(() => console.log('tro'))
//     .catch((err) => console.log(err.message))
//   }

//   /**
//    * Toggle connection when we have active device
//    * @param  {Boolean} value
//    */
//   toggleConnect (value) {
//     if (value === true && this.state.device) {
//       this.connect(this.state.device)
//     } else {
//       this.disconnect()
//     }
//   }

//   /**
//    * Write message to device
//    * @param  {String} message
//    */
//   write (message) {
//     if (!this.state.connected) {
//       console.log('You must connect to device first')
//     }

//     BluetoothSerial.write(message)
//     .then((res) => {
//       console.log('Successfuly wrote to device')
//       this.setState({ connected: true })
//     })
//     .catch((err) => console.log(err.message))
//   }

//   onDevicePress (device) {
//     if (this.state.section === 0) {
//       this.connect(device)
//     } else {
//       this.pairDevice(device)
//     }
//   }

//   // writePackets (message, packetSize = 64) {
//   // //  const toWrite = iconv.encode(message, 'cp852')
//   //   const writePromises = []
//   // //  const packetCount = Math.ceil(toWrite.length / packetSize)

//   //   for (var i = 0; i < packetCount; i++) {
//   //     const packet = new Buffer(packetSize)
//   //     packet.fill(' ')
//   //   //  toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize)
//   //     writePromises.push(BluetoothSerial.write(packet))
//   //   }

//   //   Promise.all(writePromises)
//   //   .then((result) => {
//   //   })
//   // }

//   render () {
//     const activeTabStyle = { borderBottomWidth: 6, borderColor: '#009688' }
//     return (
//       <View style={{ flex: 1 }}>
//         <View style={styles.topBar}>
//           <Text style={styles.heading}>Bluetooth Serial Example</Text>
//           {Platform.OS === 'android'
//           ? (
//             <View style={styles.enableInfoWrapper}>
//               <Text style={{ fontSize: 12, color: '#FFFFFF' }}>
//                 {this.state.isEnabled ? 'disable' : 'enable'}
//               </Text>
//               <Switch
//                 onValueChange={this.toggleBluetooth.bind(this)}
//                 value={this.state.isEnabled} />
//             </View>
//           ) : null}
//         </View>
    
//         {Platform.OS === 'android'
//         ? (
//           <View style={[styles.topBar, { justifyContent: 'center', paddingHorizontal: 0 }]}>
//             <TouchableOpacity style={[styles.tab, this.state.section === 0 && activeTabStyle]} onPress={() => this.setState({ section: 0 })}>
//               <Text style={{ fontSize: 14, color: '#FFFFFF' }}>PAIRED DEVICES</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.tab, this.state.section === 1 && activeTabStyle]} onPress={() => this.setState({ section: 1 })}>
//               <Text style={{ fontSize: 14, color: '#FFFFFF' }}>UNPAIRED DEVICES</Text>
//             </TouchableOpacity>
//           </View>
//         ) : null}
//         {this.state.discovering && this.state.section === 1
//         ? (
//           <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <ActivityIndicator
//               style={{ marginBottom: 15 }}
//               size={60} />
//             <Button
//               textStyle={{ color: '#FFFFFF' }}
//               style={styles.buttonRaised}
//               title='Cancel Discovery'
//               onPress={() => this.cancelDiscovery()} />
//           </View>
//         ) : (
    
//           <DeviceList
//             showConnectedIcon={this.state.section === 0}
//             connectedId={this.state.device && this.state.device.id}
//             devices={this.state.section === 0 ? this.state.devices : this.state.unpairedDevices}
//             onDevicePress={(device) => this.onDevicePress(device)} />
    
//         )}
    
    
//         <View style={{ alignSelf: 'flex-end', height: 52 }}>
//       <View>
//           <Button onPress={() => this.write('c')} title='off' />
//           <Button onPress={() => this.write('a')} title='on' />
//            </View>
//           <ScrollView
//             horizontal
//             contentContainerStyle={styles.fixedFooter}>
//             {Platform.OS === 'android' && this.state.section === 1
//             ? (
//               <Button
//                 title={this.state.discovering ? '... Discovering' : 'Discover devices'}
//                 onPress={this.discoverUnpaired.bind(this)} />
//             ) : null}
//             {Platform.OS === 'android' && !this.state.isEnabled
//             ? (
//               <Button
//                 title='Request enable'
//                 onPress={() => this.requestEnable()} />
//             ) : null}
//           </ScrollView>
//         </View>
//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 0.9,
//     backgroundColor: '#F5FCFF'
//   },
//   topBar: {
//     height: 56,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center' ,
//     elevation: 6,
//     backgroundColor: '#7B1FA2'
//   },
//   heading: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     alignSelf: 'center',
//     color: '#FFFFFF'
//   },
//   enableInfoWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   tab: {
//     alignItems: 'center',
//     flex: 0.5,
//     height: 56,
//     justifyContent: 'center',
//     borderBottomWidth: 6,
//     borderColor: 'transparent'
//   },
//   connectionInfoWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 25
//   },
//   connectionInfo: {
//     fontWeight: 'bold',
//     alignSelf: 'center',
//     fontSize: 18,
//     marginVertical: 10,
//     color: '#238923'
//   },
//   listContainer: {
//     borderColor: '#ccc',
//     borderTopWidth: 0.5
//   },
//   listItem: {
//     flex: 1,
//     height: 48,
//     paddingHorizontal: 16,
//     borderColor: '#ccc',
//     borderBottomWidth: 0.5,
//     justifyContent: 'center'
//   },
//   fixedFooter: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd'
//   },
//   button: {
//     height: 36,
//     margin: 5,
//     paddingHorizontal: 16,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   buttonText: {
//     color: '#7B1FA2',
//     fontWeight: 'bold',
//     fontSize: 14
//   },
//   buttonRaised: {
//     backgroundColor: '#7B1FA2',
//     borderRadius: 2,
//     elevation: 2
//   }
// })

// const Button = ({ title, onPress, style, textStyle }) =>
//   <TouchableOpacity style={[ styles.button, style ]} onPress={onPress}>
//     <Text style={[ styles.buttonText, textStyle ]}>{title.toUpperCase()}</Text>
//   </TouchableOpacity>


// const DeviceList = ({ devices, connectedId, showConnectedIcon, onDevicePress }) =>
//   <ScrollView style={styles.container}>
//     <View style={styles.listContainer}>
//       {devices.map((device, i) => {
//         return (
//           <TouchableHighlight
//             underlayColor='#DDDDDD'
//             key={`${device.id}_${i}`}
//             style={styles.listItem} onPress={() => onDevicePress(device)}>
//             <View style={{ flexDirection: 'row' }}>
//               {showConnectedIcon
//               ? (
//                 <View style={{ width: 48, height: 48, opacity: 0.4 }}>
//                   {connectedId === device.id
//                   ? (
//                     <Text style={{ fontWeight: 'bold' }}>eyow</Text>
//                   ) : null}
//                 </View>
//               ) : null}
//               <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
//                 <Text style={{ fontWeight: 'bold' }}>{device.name}</Text>
//                 <Text>{`<${device.id}>`}</Text>
//               </View>
//             </View>
//           </TouchableHighlight>
//         )
//       })}
//     </View>
//   </ScrollView>


//     //       <Button onPress={() => this.write('c')} title='off' />
//     //       <Button onPress={() => this.write('a')} title='on' />
