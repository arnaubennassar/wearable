import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TextInput,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity
} from "react-native";
import { login, register, verify } from "../buissLogic/AWSLogin";
import { getPersonalData } from "../buissLogic/api";
import Swiper from "react-native-swiper";
import { Button, Form, Item, Input, InputGroup } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

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
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardWillHide
    );
  },
  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  },
  keyboardWillShow(event) {
  //  mTop = 407.5;
  },

  keyboardWillHide(event) {
  //  mTop = 307.5;
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
      ////// LOAD USER DATA //////
      this.tokenAWS = res.message
      getPersonalData(this.tokenAWS, this.handlerPersonalData);

          //ADD NEW PERSISTENT CLOUD DATA HERE


    } else {
      this.props.actions.loginFail(res.message);
      if (res.message == "User is not confirmed.") {
        this.props.actions.validateMode();
      }
    }
  },
  //HANDLE PERSONAL DATA RESPONSE
  handlerPersonalData(res){
    console.log(res);
    if(res.data.Items.length > 0){
      var data = res.data.Items[0];
      this.props.actions.setPersonalData (data.height, data.weight, data.age);
    }
    this.completeLogin();
  },
  completeLogin(){
    ++completedLogin;
    if (completedLogin == 1){
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
  //HANDLE VALIDATION RESPONSE
  handlerValidation(res) {
    if (res.success) {
      this.props.actions.validationSuccess();
    } else {
      this.props.actions.validationFail(res.message);
    }
  },
  ////
  //focus next field
  focusNextField(id) {
    console.log(this.refs[id]);
    this.refs[id]._root.focus();
  },
  ////
  //RENDER THE UI
  render() {
    return (
      <KeyboardAvoidingView style={styles.super} behavior="position">
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
                marginTop: 307.5,
                alignSelf: "center",
                width: 243.3,
                height: 41
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
                  fontSize: 14,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Item
              rounded
              style={{
                justifyContent: "center",
                alignSelf: "center",
                width: 243.3,
                height: 41,
                borderColor: "#F53B91",
                marginTop: 9
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
                  fontSize: 14,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Button
              rounded
              rounded
              style={{
                justifyContent: "center",
                marginTop: 9,
                alignSelf: "center",
                backgroundColor: "#F53B91",
                width: 243.3,
                height: 41
              }}
              onPress={this.onLoginButtonPress}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "System",
                  fontWeight: "100"
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
                  position: "absolute",
                  bottom: 50,
                  alignSelf: "center"
                }}
                animating
                size="large"
              />
            ) : null}
            {this.props.state.loginError != "" ? (
              <Text style={styles.textError}>
                {" "}
                {this.props.state.loginError}{" "}
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
                marginTop: 85,
                marginLeft: 70,
                marginRight: 70,
                textAlign: "center",
                fontFamily: "System",
                fontWeight: "100",
                fontSize: 14
              }}
            >
              Supply the following information to start using Womba...
            </Text>
            <Item
              rounded
              style={{
                justifyContent: "center",
                borderColor: "#F53B91",
                marginTop: 53.5,
                alignSelf: "center",
                width: 243.3,
                height: 41
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
                  fontSize: 14,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Item
              rounded
              style={{
                justifyContent: "center",
                borderColor: "#F53B91",
                marginTop: 9,
                alignSelf: "center",
                width: 243.3,
                height: 41
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
                  fontSize: 14,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Item
              rounded
              style={{
                justifyContent: "center",
                alignSelf: "center",
                width: 243.3,
                height: 41,
                borderColor: "#F53B91",
                marginTop: 9
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
                  fontSize: 14,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Button
              rounded
              rounded
              style={{
                justifyContent: "center",
                marginTop: 57,
                alignSelf: "center",
                backgroundColor: "#F53B91",
                width: 243.3,
                height: 41
              }}
              onPress={this.onRegisterButtonPress}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "System",
                  fontWeight: "100"
                }}
              >
                Register
              </Text>
            </Button>
            {this.props.state.registerError != "" ? (
              <Text style={styles.textError}>
                {" "}
                {this.props.state.registerError}{" "}
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
                marginTop: 85,
                marginLeft: 70,
                marginRight: 70,
                textAlign: "center",
                fontFamily: "System",
                fontWeight: "100",
                fontSize: 14
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
                marginTop: 85.5,
                alignSelf: "center",
                width: 243.3,
                height: 41
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
                  fontSize: 14,
                  fontWeight: "900"
                }}
              />
            </Item>
            <Button
              rounded
              rounded
              style={{
                justifyContent: "center",
                marginTop: 9,
                alignSelf: "center",
                backgroundColor: "#F53B91",
                width: 243.3,
                height: 41
              }}
              onPress={this.onValidateButtonPress}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "System",
                  fontWeight: "100"
                }}
              >
                Validate
              </Text>
            </Button>
            {this.props.state.validateError != "" ? (
              <Text style={styles.textError}>
                {" "}
                {this.props.state.validateError}{" "}
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
      </KeyboardAvoidingView>
    );
  }
}));
//"CSS"
const styles = StyleSheet.create({
  super: {},
  container: {
    flex: 1,
    alignSelf: "stretch",
    width: undefined,
    height: undefined,
    resizeMode: "cover"
  },
  boldText: {
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "900",
    fontSize: 14
  },
  lightText: {
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: 14
  },
  arrowTouch: { marginTop: 67, marginLeft: 67, width: 20, height: 20 },
  registerTouch: {
    marginTop: 33.5,
    marginBottom: 186.5,
    marginLeft: 90,
    marginRight: 90
  },
  registerText: {
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: 14
  },
  button: { flex: 1, width: 300 },
  textInput: {
    justifyContent: "center",
    marginTop: 9,
    alignSelf: "center",
    backgroundColor: "transparent",
    width: 243.3,
    height: 50
  },
  textError: {
    position: "absolute",
    bottom: 100,
    textAlign: "center",
    left: 60,
    right: 60,
    fontFamily: "System",
    fontWeight: "100",
    fontSize: 14,
    color: "red"
  }
});
