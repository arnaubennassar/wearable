/*@flow*/
// REACT & REDUX
import React from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as userActions from './redux/actions/user';
import * as dataActions from './redux/actions/data';
import * as BTActions from './redux/actions/BT';
import * as notificationsActions from './redux/actions/notifications';
//
// NOTIFICATIONS
import OneSignal from 'react-native-onesignal';
//
// CONTAINER COMPONENTS TO RENDER
import TabNav from './navigation/TabNav';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import PersonalDataScreen from './components/PersonalDataScreen';
//


//import {BlueTooth} from './components/BlueTooth' 
import * as BT from './components/BlueTooth';
import { processData } from './buissLogic/dataProcessor'
import {postOSID, getNotifications} from './buissLogic/api'
import {getAllData, checkDay, clearData} from './buissLogic/storage'
//CONNECT TO REDUX state & actions
function mapStateToProps(state){return{state: state};};
function mapDispatchToProps(dispatch){return {
    actions: {
      user: bindActionCreators(userActions, dispatch), 
      data: bindActionCreators(dataActions, dispatch), 
      BT: bindActionCreators(BTActions, dispatch), 
      notifications: bindActionCreators(notificationsActions, dispatch), 
    }       
}};
//
var waitingBTReq = false; 
var waitingBTData = false; 
var APP  = React.createClass({
//SETUP NOTIFICATIONS
  componentWillMount() {
    var now = Date.parse(new Date())
      console.log( new Date(now).getDate() )
    //INITIAL STATE for splash screen only 
      this.setState({user: {user: {appInitialized: false}} });
    //NOTIFICATIONS LISTENERS
      OneSignal.addEventListener('received', this.onReceived);
      OneSignal.addEventListener('opened', this.onOpened);
      OneSignal.addEventListener('registered', this.onRegistered);
      OneSignal.addEventListener('ids', this.onIds);
    //BLUETOOTH
       BT.subscribe(this.BTGetData, this.BTDisconnected, this.BTDisabled);
    //   BT.enable(this.BTEnabled);    
  //   BT.enable(this.BTEnabled);
  },

  componentWillUnmount() {
      OneSignal.removeEventListener('received', this.onReceived);
      OneSignal.removeEventListener('opened', this.onOpened);
      OneSignal.removeEventListener('registered', this.onRegistered);
      OneSignal.removeEventListener('ids', this.onIds);
      // BT.disconnect();
      // BT.disable();
  },
  componentDidMount(){
    // BT.subscribe(this.BTGetData, this.BTDisconnected, this.BTDisabled);
    // BT.connect(this.BTConnected);
  },

  onReceived(notification) {
      getNotifications(this.props.state.user.user.tokenAWS, null, (res) => {
        this.props.actions.notifications.notificationsUpdated(res.data.Items);
      });
  },
  onOpened(openResult) {
    // console.log('Message: ', openResult.notification.payload.body);
    // console.log('Data: ', openResult.notification.payload.additionalData);
    // console.log('isActive: ', openResult.notification.isAppInFocus);
    // console.log('openResult: ', openResult);
  },

  onRegistered(notifData) {
    console.log("Device had been registered for push notifications!", notifData);
  },

  onIds(device) {
    this.props.actions.user.OSRegistered(device.userId);
  },
//
//RENDER THE UI
  render(){
    // if(!waitingBTData && petitionBTResponded){
    //   BT.write(() => {}, 'k');
    // }
///////BT
    // if(this.props.state.BT.BT.enabled && !this.props.state.BT.BT.connected && !this.props.state.BT.BT.connecting){
    //   BT.connect(this.BTConnected);
    // }
    // else if(this.props.state.BT.BT.enabled && !this.props.state.BT.BT.connected && !this.props.state.BT.BT.connecting){
    //     BT.connect(this.BTConnected);
    //     this.props.actions.BT.connecting();
    // }




  //RENDER SPLASHSCREEN (+ init app logic)
    if(!this.props.state.user.user.appInitialized)
    {
      console.log('SPLASH')
      return( <SplashScreen complete={this.props.actions.user.appInitialized} dataUpdated={this.props.actions.data.dataUpdated}/> );
    }
  //RENDER AUTHSCREEN (+ login/register logic)
    else if(!this.props.state.user.user.loggedIn)
    {
      console.log('AUTH')
      return( <AuthScreen actions={this.props.actions.user} state={this.props.state.user.user}/> );
    }
  //RENDER PERSONALDATASCREEN 
    else if(!this.props.state.user.user.skipPersonalData)
    {
      console.log('PERSONALDATA')
      return( <PersonalDataScreen actions={this.props.actions.user} tokenAWS={this.props.state.user.user.tokenAWS}/> );
    }
 // RENDER BTSCREEN 
    // else if(!this.props.state.BT.BT.skip)
    // {
    //   console.log('BT')
    //   postOSID(this.props.state.user.user.tokenAWS, this.props.state.user.user.tokenOS);
    //   return( <BT.BTScreen actions={this.props.actions.BT} state={this.props.state.BT.BT}/> );
    // }
  //RENDER TabNav (Top navigation ==> MainScreen)
    else 
    {
     // console.log('NAVIGATION')
      return ( <TabNav hideTabBar={this.props.state.tab.params.hideTabBar}/>  );
    }
  },
  BTEnabled(){
  //  BT.connect(this.BTConnected);
    this.props.actions.BT.enabled();
    //this.props.actions.BT.connecting();
  },
  BTDisabled(){
    this.props.actions.BT.disabled();
  },
  BTConnected(success){
    if(success){
      this.props.actions.BT.connected( Date.parse(new Date()) );
    }
    else{
      console.log('why this')
      //BT.connect(this.BTConnected);
      //this.props.actions.BT.desconnected();
    }
  },
  BTDisconnected(){
//    BT.disconnect();
    this.props.actions.BT.desconnected();
    console.log('BT DISConnected!!!!!')
    // getAllData('a',(data)=>{
    //   clearData();
    //   console.log('gotcha activity data')
    //   //console.log(data);
    //   processData({a: data}, 0, 'AWS', 'mail', 'pass');
    // })
    // checkDay('a');
    // checkDay('h');
    //checkDay('t');
    //processData(  {t: [{v: 36, c: Date.parse(new Date())}]}/*JSON.parse( data.data.slice(0, -1) )*/  , 0, this.props.state.user.user.tokenAWS, this.props.state.user.user.email, this.props.state.user.user.password, 1506340031019 );
  },
  BTGetData(data){
    //console.log(data);
    if (!waitingBTReq && !waitingBTData ){//WAITING ACK
      console.log("WAITING DATA REQUEST");
      if (data.data == "r\r\n") {
        console.log(" <===   DATA REQUEST RECEIVED   ===");
        console.log("===   SENDING DATA REQUEST ACK   ===>");
        waitingBTData = true;
        BT.write(() => {}, 'a');
      }
      else{
        console.log(" <===   UNECSPECTED MESSAGE RECEIVED   ===");
        console.log("===   SENDING RESET REQUEST   ===>");
        BT.write(() => {}, 'a');
      }
    }
    else if (!waitingBTReq && waitingBTData){//WAITING DATA
      console.log("WAITING DATA");
      if (data.data == "r\r\n") {
        BT.write(() => {}, 'a');
      }
      else{//DATA RECEIVED
        console.log( " <===   DATA RECEIVED   ===");
        console.log("===   SENDING DATA ACK   ===>");
        processData(  JSON.parse( data.data.slice(0, -1) )  , this.props.state.BT.BT.timeStamp, this.props.state.user.user.tokenAWS, true);
        BT.write(() => {}, 'k');
        waitingBTData = false;
        petitionBTResponded = true;
      }
    }
    else {//WAITING ACK
      console.log("WAITING DATA REQUEST")
      if (data.data != "r\r\n") {
        console.log(" <===   UNECSPECTED MESSAGE RECEIVED   ===");
        console.log("===   SENDING RESET REQUEST   ===>");
        BT.write(() => {}, 'k');
      }
      else{
        console.log(" <===   DATA REQUEST RECEIVED   ===");
        console.log("===   SENDING DATA REQUEST ACK   ===>");
        waitingBTData = true;
        petitionBTResponded = false;
        BT.write(() => {}, 'a');
      }
    }
  }

});
//
//CONNECT TO REDUX state & actions
export default connect(mapStateToProps, mapDispatchToProps)(APP);
//