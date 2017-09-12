/*@flow*/
// REACT & REDUX
import React from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as userActions from './redux/actions/user';
import * as BTActions from './redux/actions/BT';
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



import * as BT from './components/BlueTooth';
import { recieveBT } from './buissLogic/blue'

//CONNECT TO REDUX state & actions
function mapStateToProps(state){return{state: state};};
function mapDispatchToProps(dispatch){return {
    actions: {
      user: bindActionCreators(userActions, dispatch), 
      BT: bindActionCreators(BTActions, dispatch), 
    }       
}};
//
var APP  = React.createClass({
//SETUP NOTIFICATIONS
  componentWillMount() {
    //INITIAL STATE for splash screen only 
      this.setState({user: {user: {appInitialized: false}} });
    //NOTIFICATIONS LISTENERS
      OneSignal.addEventListener('received', this.onReceived);
      OneSignal.addEventListener('opened', this.onOpened);
      OneSignal.addEventListener('registered', this.onRegistered);
      OneSignal.addEventListener('ids', this.onIds);
    //BLUETOOTH
      BT.subscribe(this.BTGetData, this.BTDisconnected);
      BT.connect(this.BTConnected);
  },

  componentWillUnmount() {
      OneSignal.removeEventListener('received', this.onReceived);
      OneSignal.removeEventListener('opened', this.onOpened);
      OneSignal.removeEventListener('registered', this.onRegistered);
      OneSignal.removeEventListener('ids', this.onIds);
      BT.disconnect();
  },

  onReceived(notification) {
      console.log("Notification received: ", notification);
  },
  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
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


    return (  <SplashScreen complete={this.props.actions.user.appInitialized}/>  )



  //RENDER SPLASHSCREEN (+ init app logic)
    if(!this.props.state.user.user.appInitialized)
    {
      console.log('SPLASH')
      return( <SplashScreen complete={this.props.actions.user.appInitialized}/> );
    }
  //RENDER AUTHSCREEN (+ login/register logic)
    else if(!this.props.state.user.user.loggedIn)
    {
      console.log('AUTH')
      return( <AuthScreen actions={this.props.actions.user} state={this.props.state.user.user}/> );
    }
  //RENDER PERSONALDATASCREEN (+ login/register logic)
    else if(!this.props.state.user.user.skipPersonalData)
    {
      console.log('PERSONALDATA')
      return( <PersonalDataScreen actions={this.props.actions.user} tokenAWS={this.props.state.user.user.tokenAWS}/> );
    }
  //RENDER TabNav (Top navigation ==> MainScreen)
    else 
    {
      console.log('NAVIGATION')
      return ( <TabNav hideTabBar={this.props.state.tab.params.hideTabBar}/>  );
    }
  },
  BTConnected(){
    console.log('BTConnected!!!!!')
    this.props.actions.BT.connected( Date.parse(new Date()) );
  },
  BTDisconnected(){
    console.log('BT DISConnected!!!!!')
  },
  BTGetData(data){
    console.log(data)
    recieveBT(data, this.props.state.BT.BT.timeStamp);
  }

});
//
//CONNECT TO REDUX state & actions
export default connect(mapStateToProps, mapDispatchToProps)(APP);
//