import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TextInput,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { login, register, verify, silentLogin } from "../buissLogic/AWSLogin";
import { getPersonalData, getAllData, sendNotification, getNotifications } from "../buissLogic/api";
import { storeData_i, storeData_i_last } from "../buissLogic/storage";
import Swiper from "react-native-swiper";
import { Button, Form, Item, Input, InputGroup } from "native-base";
import {processData} from '../buissLogic/dataProcessor';
import Icon from "react-native-vector-icons/FontAwesome";


const hait = Dimensions.get('window').height;
const wiz = Dimensions.get('window').width;

var userInput = "";
var emailInput = "";
var passInput = "";
var validateInput = "";
var currentScreen = 0;
var completedLogin = 0;
var tokenAWS = "";

i1 = require("../resources/images/B1.png");
i2 = require("../resources/images/B2.png");
i3 = require("../resources/images/B3.png");
mTop = 307.5;
first = true;
export default (AuthScreen = React.createClass({
  componentWillMount() {
    first = true;
    if (this.props.state.validating) {
      currentScreen = 2;
    } else if (this.props.state.registering) {
      currentScreen = 1;
    } else {
      currentScreen = 0;
    }
  },

  componentWillUpdate(nextProps) {
    if (nextProps.state.validating) {
      if (this.props.state.registering) {
        this.refs._swiper.scrollBy(1, true);
      } else if (!this.props.state.validating) {
        this.refs._swiper.scrollBy(2, true);
      }
    } else if (nextProps.state.registering) {
      if (!this.props.state.registering) {
        this.refs._swiper.scrollBy(1, true);
      }
    } else {
      if (this.props.state.registering) {
        this.refs._swiper.scrollBy(-1, true);
      } else if (this.props.state.validating) {
        this.refs._swiper.scrollBy(-2, true);
      }
    }
  },
  //BUTTONS//
  //SEND LOGIN
  onLoginButtonPress() {
    this.props.actions.loginStart(this.userInput, this.passInput);
    login(this.userInput, this.passInput, this.handlerLogin);
  },
  //REGISTER MODE
  onRegisterModeButtonPress() {
    this.props.actions.registerMode();
  },
  //SEND REGSITER
  onRegisterButtonPress() {
    this.props.actions.registerStart(this.userInput, this.passInput);
    register(
      this.userInput,
      this.emailInput,
      this.passInput,
      this.handlerRegister
    );
  },
  //SEND VALIDATION
  onValidateButtonPress() {
    this.props.actions.validationStart();
    verify(this.props.state.email, this.validateInput, this.handlerValidation);
  },
  //CANCEL REGISTER/VALIDATION
  onCancelButtonPress() {
    if (this.props.state.registering) {
      this.props.actions.cancelRegister();
    } else {
      this.props.actions.cancelValidation();
    }
  },
  ////
  //HANDLERS//
  //HANDLE LOGIN RESPONSE
  handlerLogin(res) {
    if (res.success) {

    //    FAKE DATA     //
      this.createFakeData();
      this.completeLogin();
    //    GET DATA FROM AWS     //

      // this.tokenAWS = res.message
      // ////// LOAD USER DATA //////
      // getPersonalData(this.tokenAWS, this.handlerPersonalData);
      // getNotifications(this.tokenAWS, null, (res) => {
      //   this.props.notificationsActions.notificationsUpdated(res.data.Items);
      //   this.completeLogin();
      // });
      // this._getAllData('ACTIVITY', 'a', (ans) => { 
      //   if(ans != false){
      //     processData({a: ans}, 0, false); 
      //   }
      //   this.completeLogin();
      // });
      // this._getAllData('HEART', 'h', (ans) => { 
      //   if(ans != false){
      //     processData({h: ans}, 0, false); 
      //   }
      //   this.completeLogin();
      // });
      // this._getAllData('TEMPERATURE', 't', (ans) => { 
      //   if(ans != false){
      //     processData({t: ans}, 0, false); 
      //   }
      //   this.completeLogin();
      // });
      // this._getAllData('BBT', 'b', (ans) => { 
      //   if(ans != false){
      //     processData({b: ans}, 0, false); 
      //   }
      //   this.completeLogin();
      // });      
      // this._getAllData('SLEEP', 's', (ans) => { 
      //   if(ans != false){
      //     processData({s: ans}, 0, false); 
      //   }
      //   this.completeLogin();
      // });
    } else {
      this.props.actions.loginFail(res.message);
      if (res.message == "User is not confirmed." || res.message == "Password reset required for the user") {
        this.props.actions.validateMode();
      }
    }
  },
  _getAllData(url, dataType, handler){
    getAllData(this.tokenAWS, url, null, (ans) => {
  //    console.log(ans)
        if (ans.hasOwnProperty('error') ){
  //      console.log('NOPE')
          handler(false);
        }
        else {
          res = [];
        //  console.log(ans);
          for (var i = 0; i < ans.length; i++) {
            res.push.apply(res, ans[i].data)
          };
          handler(res);
        }
    });
  },
  //HANDLE PERSONAL DATA RESPONSE
  handlerPersonalData(res){
  //  console.log(res);
    if(res.data.Items.length > 0){
      var data = res.data.Items[0];
      this.props.actions.setPersonalData (data.height, data.weight, data.age);
    }
    this.completeLogin();
  },
  completeLogin(){
    ++completedLogin;
  //  console.log('login completed : ' + completedLogin + ' / 7' )
    if (completedLogin == 1){
      completedLogin = 0;
      this.props.actions.loginSuccess(this.tokenAWS);
    }
  },
  //HANDLE REGISTER RESPONSE
  handlerRegister(res) {
    if (res.success) {
      this.props.actions.registerSuccess();
    } else {
      this.props.actions.registerFail(res.message);
    }
  },
  createFakeData(){
      var NOW = Date.parse(new Date());
//      var token = res.message;
      prevT = Math.random() * (38 - 36) + 36;
      fakeData_activity = [];
      fakeData_BBT = [];
      fakeData_sleep = [];
      for (var i = 0; i < 35; i++) {
        var time = NOW - ( (35 - i)*86400000 )
        var cTemp = prevT + Math.random()*2;
        if (i > 20 && i < 30){
          cTemp = prevT - Math.random()*2;
          while(cTemp < 36){
            var cTemp = cTemp + Math.random()*2;
          }
        }
        while (cTemp > 38.5){
          cTemp = cTemp - Math.random()*2;
        }
        prevT = cTemp;
        fakeData_BBT.push.apply(fakeData_BBT, [{c: time, v: cTemp}]);
        //fakeData_BBT[i] = [{c: time, v: cTemp}];
        //postData([{c: time, v: cTemp}], time.toString(), token, 'BBT', (response)=>{console.log(response)})
        var sv = Math.random() * (39600000 - 18000000) + 18000000;
        fakeData_sleep.push.apply(fakeData_sleep, [{c: time, v: sv, sleep: true, c_out: time + sv }]);
        //fakeData_sleep[i] = [{c: time, v: sv, sleep: true, c_out: time + sv }];
        //postData([{c: time, v: sv, sleep: true, c_out: time + sv }], time.toString(), token, 'SLEEP', (response)=>{console.log(response)})
        activityData_ = [];
        for (var j = 0; j < 4; j++) {
          val = Math.random() * 20000 + 250; 
          activityData_[j] = {v: val, c: time + j, aX: val * Math.random(), aY: val * Math.random(), aZ: val * Math.random(), gX: val * Math.random(), gY: val * Math.random(), gZ: val * Math.random()}
        };
        fakeData_activity.push.apply(fakeData_activity, activityData_);
        //fakeData_activity[i] = activityData_;
        //postData(activityData_, time.toString(), token, 'ACTIVITY', (response)=>{console.log(response)})
      };
      processData({a: fakeData_activity}, 0, false);
      processData({b: fakeData_BBT}, 0, false);
      processData({s: fakeData_sleep}, 0, false);
  },
  //HANDLE VALIDATION RESPONSE
  handlerValidation(res) {
    if (res.success) {
      this.createFakeData();
      silentLogin(this.userInput, this.passInput, (token) => {
          this.props.actions.loginSuccess(token);
          sendNotification ('Welcome!', 
            'Welcome to Womba, tap this message to know more about this app.', 
            'user', 
            {fullDescription: 'README comming soon!'}, 
            token, 
            (ans) => {}
          );
      })
      this.props.actions.validationSuccess();
    } else {
      this.props.actions.validationFail(res.message);
    }
  },
  ////
  //focus next field
  focusNextField(id) {
    this.refs[id]._root.focus();
  },
  ////
  //RENDER THE UI
  render() {
    return (
        <Swiper
          scrollEnabled={false}
          pagingEnabled={false}
          showsPagination={false}
          index={currentScreen}
          ref="_swiper"
        >
          <Image style={styles.container} source={i1}>
            <Item
              rounded
              style={{
                justifyContent: "center",
                borderColor: "#F53B91",
                marginTop: hait*0.4,
                alignSelf: "center",
                width: wiz*0.6,
                height: hait*0.06
              }}
            >
              <Input
                returnKeyType="next"
                blurOnSubmit={ false }
                onSubmitEditing={() => {
                  this.focusNextField('passi');
                }}
                onChangeText={text => (this.userInput = text)}
                placeholder="Username / email"
                placeholderTextColor="#8F8F8F"
                style={{
                  textAlign: "center",
                  fontFamily: "System",
                  fontSize: hait*0.02,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Item
              rounded
              style={{
                justifyContent: "center",
                alignSelf: "center",
                width: wiz*0.6,
                height: hait*0.06,
                borderColor: "#F53B91",
                marginTop: hait*0.01
              }}
            >
              <Input
                ref='passi'
                returnKeyType="done"
                onSubmitEditing={() => {
                  this.onLoginButtonPress();
                }}
                onChangeText={text => (this.passInput = text)}
                placeholder="Password"
                placeholderTextColor="#8F8F8F"
                secureTextEntry={true}
                style={{
                  textAlign: "center",
                  fontFamily: "System",
                  fontSize: hait*0.02,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Button
              rounded
              rounded
              style={{
                justifyContent: "center",
                marginTop: hait*0.01,
                alignSelf: "center",
                backgroundColor: "#F53B91",
                width: wiz*0.6,
                height: hait*0.06
              }}
              onPress={this.onLoginButtonPress}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "System",
                  fontWeight: "100",
                  fontSize: hait*0.02
                }}
              >
                Log in
              </Text>
            </Button>
            <TouchableOpacity
              style={styles.registerTouch}
              hitSlop={{ top: 5, bottom: 15, left: 15, right: 15 }}
              onPress={this.onRegisterModeButtonPress}
            >
              <Text style={styles.registerText}>Have not registered yet?</Text>
            </TouchableOpacity>
            {this.props.state.loadingLogin ? (
              <ActivityIndicator
                style={{
                  marginTop: 10,
                  alignSelf: "center"
                }}
                animating
                size="large"
              />
            ) : null}
            {this.props.state.loginError != "" ? (
              <Text style={styles.textError}>
                {this.props.state.loginError}
              </Text>
            ) : null}
          </Image>

          <Image style={styles.container} source={i2}>
            <TouchableOpacity
              style={styles.arrowTouch}
              hitSlop={{ top: 10, bottom: 20, left: 35, right: 35 }}
              onPress={this.onCancelButtonPress}
            >
              <Icon size={20} name={"arrow-left"} color={"#F53B91"} />
            </TouchableOpacity>
            <Text
              style={{
                marginTop: hait*0.1,
                marginLeft: 70,
                marginRight: 70,
                textAlign: "center",
                fontFamily: "System",
                fontWeight: "100",
                fontSize: hait*0.02
              }}
            >
              Supply the following information to start using Womba...
            </Text>
            <Item
              rounded
              style={{
                justifyContent: "center",
                borderColor: "#F53B91",
                marginTop: hait*0.1,
                alignSelf: "center",
                width: wiz*0.6,
                height: hait*0.06
              }}
            >
              <Input
                blurOnSubmit={ false }
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.focusNextField('email');
                }}
                onChangeText={text => (this.userInput = text)}
                placeholder="Username"
                placeholderTextColor="#8F8F8F"
                style={{
                  textAlign: "center",
                  fontFamily: "System",
                  fontSize: hait*0.02,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Item
              rounded
              style={{
                justifyContent: "center",
                borderColor: "#F53B91",
                marginTop: hait*0.01,
                alignSelf: "center",
                width: wiz*0.6,
                height: hait*0.06
              }}
            >
              <Input
                blurOnSubmit={ false }
                ref='email'
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.focusNextField('pass2');
                }}
                onChangeText={text => (this.emailInput = text)}
                placeholder="Email"
                placeholderTextColor="#8F8F8F"
                style={{
                  textAlign: "center",
                  fontFamily: "System",
                  fontSize: hait*0.02,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Item
              rounded
              style={{
                justifyContent: "center",
                alignSelf: "center",
                width: wiz*0.6,
                height: hait*0.06,
                borderColor: "#F53B91",
                marginTop: hait*0.01
              }}
            >
              <Input
                ref='pass2'
                returnKeyType="done"
                onSubmitEditing={() => {
                  this.onRegisterButtonPress();
                }}
                onChangeText={text => (this.passInput = text)}
                placeholder="Password"
                placeholderTextColor="#8F8F8F"
                secureTextEntry={true}
                style={{
                  textAlign: "center",
                  fontFamily: "System",
                  fontSize: hait*0.02,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Button
              rounded
              rounded
              style={{
                justifyContent: "center",
                marginTop: hait*0.15,
                alignSelf: "center",
                backgroundColor: "#F53B91",
                width: wiz*0.6,
                height: hait*0.06
              }}
              onPress={this.onRegisterButtonPress}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "System",
                  fontWeight: "100",
                  fontSize: hait*0.02
                }}
              >
                Register
              </Text>
            </Button>
            {this.props.state.registerError != "" ? (
              <Text style={styles.textError}>
                {this.props.state.registerError}
              </Text>
            ) : null}
            {this.props.state.registerLoading ? (
              <ActivityIndicator
                style={{
                  position: "absolute",
                  bottom: 50,
                  alignSelf: "center"
                }}
                animating
                size="large"
              />
            ) : null}
          </Image>

          <Image source={i3} style={styles.container}>
            <TouchableOpacity
              style={styles.arrowTouch}
              hitSlop={{ top: 10, bottom: 20, left: 35, right: 35 }}
              onPress={this.onCancelButtonPress}
            >
              <Icon size={20} name={"arrow-left"} color={"#F53B91"} />
            </TouchableOpacity>
            <Text
              style={{
                marginTop: hait*0.1,
                marginLeft: 70,
                marginRight: 70,
                textAlign: "center",
                fontFamily: "System",
                fontWeight: "100",
                fontSize: hait*0.02
              }}
            >
              We have sent you a code to your email address. Make sure you
              received it and type it below…
            </Text>
            <Item
              rounded
              style={{
                justifyContent: "center",
                borderColor: "#F53B91",
                marginTop: hait*0.2,
                alignSelf: "center",
                width: wiz*0.6,
                height: hait*0.06
              }}
            >
              <Input
                returnKeyType="done"
                onSubmitEditing={() => {
                  this.onValidateButtonPress();
                }}
                onChangeText={text => (this.validateInput = text)}
                placeholder="Introduce code"
                placeholderTextColor="#8F8F8F"
                style={{
                  textAlign: "center",
                  fontFamily: "System",
                  fontSize: hait*0.02,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Button
              rounded
              rounded
              style={{
                justifyContent: "center",
                marginTop: hait*0.01,
                alignSelf: "center",
                backgroundColor: "#F53B91",
                width: wiz*0.6,
                height: hait*0.06
              }}
              onPress={this.onValidateButtonPress}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "System",
                  fontWeight: "100",
                  fontSize: hait*0.02
                }}
              >
                Validate
              </Text>
            </Button>
            {this.props.state.validateError != "" ? (
              <Text style={styles.textError}>
                {this.props.state.validateError}
              </Text>
            ) : null}
            {this.props.state.validateLoading ? (
              <ActivityIndicator
                animating
                size="large"
                style={{
                  position: "absolute",
                  bottom: 50,
                  alignSelf: "center"
                }}
              />
            ) : null}
          </Image>
          <StatusBar translucent backgroundColor="transparent" />
        </Swiper>
    );
  }
}));
//"CSS"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    width: undefined,
    height: undefined,
    resizeMode: "cover"
  },
  boldText: {
    backgroundColor:'transparent',
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "900",
    fontSize: hait*0.02
  },
  lightText: {
    backgroundColor:'transparent',
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: hait*0.02
  },
  arrowTouch: { marginTop: 67, marginLeft: 67, width: 20, height: 20 },
  registerTouch: {
    backgroundColor:'transparent',
    marginTop: hait*0.2,
    marginLeft: 90,
    marginRight: 90
  },
  registerText: {
    backgroundColor:'transparent',
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: hait*0.02
  },
  button: { flex: 1, width: 300 },
  textInput: {
    backgroundColor:'transparent',
    justifyContent: "center",
    marginTop: 9,
    alignSelf: "center",
    backgroundColor: "transparent",
    width: 243.3,
    height: 50
  },
  textError: {
    backgroundColor:'transparent',
    position: "absolute",
    bottom: 100,
    textAlign: "center",
    left: 60,
    right: 60,
    fontFamily: "System",
    fontWeight: "100",
    fontSize: hait*0.02,
    color: "red"
  }
});
