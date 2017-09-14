import React, { Component } from "react";
import {
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity
} from "react-native";
import { Button, Form, Item, Input, InputGroup } from "native-base";
import { NavigationActions } from 'react-navigation';
import {postPersonalData} from '../buissLogic/api';

var heightInput = "";
var weightInput = "";
var ageInput = "";
var actions;
var tokenAWS;
i = require("../resources/images/B3.png");

export default (PersonalDataScreen = React.createClass({
  componentWillMount () {
    if (this.props.navigation !== undefined){
      const setParamsAction = NavigationActions.setParams({
        params: { hideTabBar: true },
        key: 'ProfileStack',
      });
      this.props.navigation.dispatch(setParamsAction);
      this.tokenAWS = this.props.navigation.state.params.tokenAWS;
      this.actions = this.props.navigation.state.params.actions;
      this.heightInput = this.props.navigation.state.params.height.toString();
      this.weightInput = this.props.navigation.state.params.weight.toString();
      this.ageInput = this.props.navigation.state.params.age.toString();
    }
    else{
      this.tokenAWS = this.props.tokenAWS;
      this.actions = this.props.actions;
    }
  },
  onNextButtonPress() {
    postPersonalData(
      this.tokenAWS,
      Number(this.heightInput),
      Number(this.weightInput),
      Number(this.ageInput)
    );
    this.actions.setPersonalData(
      Number(this.heightInput),
      Number(this.weightInput),
      Number(this.ageInput)
    );
  },
  onSkipButtonPress() {
    this.actions.skipPersonalData();
  },
  focusNextField(id) {
    this.refs[id]._root.focus();
  },
  render() {
    return (
      <Image style={styles.container} source={i}>
      <KeyboardAvoidingView style={styles.super} behavior="position">
        <Text style={styles.text1}>Set up your profile...</Text>
        <Item
          rounded
          style={{
            justifyContent: "center",
            borderColor: "#F53B91",
            marginTop: 57.5,
            alignSelf: "center",
            width: 243.3,
            height: 41
          }}
        >
          <Input
            onChangeText={text => (this.heightInput = text)}
            placeholder="Height"
            defaultValue={this.heightInput}
            placeholderTextColor="#8F8F8F"
            keyboardType="numeric"
            onSubmitEditing={() => {
              this.focusNextField('weight');
            }}
            blurOnSubmit={ false }
            returnKeyType="next"
            style={{
              textAlign: "center",
              fontFamily: "System",
              fontSize: 14,
              fontWeight: "900"
            }}
          />
          <Text style={styles.textDetail}>cm</Text>
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
            onChangeText={text => (this.weightInput = text)}
            placeholder="Weight"
            defaultValue={this.weightInput}
            placeholderTextColor="#8F8F8F"
            keyboardType="numeric"
            onSubmitEditing={() => {
              this.focusNextField('age');
            }}
            blurOnSubmit={ false }
            returnKeyType="next"
            style={{
              textAlign: "center",
              fontFamily: "System",
              fontSize: 14,
              fontWeight: "900"
            }}
            ref= 'weight'
          />
          <Text style={styles.textDetail}>kg</Text>
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
            onChangeText={text => (this.ageInput = text)}
            placeholder={"Age"}
            defaultValue={this.ageInput}
            placeholderTextColor="#8F8F8F"
            keyboardType="numeric"
            onSubmitEditing={() => {
              this.onNextButtonPress();
            }}
            returnKeyType="done"
            style={{
              textAlign: "center",
              fontFamily: "System",
              fontSize: 14,
              fontWeight: "900"
            }}
            ref= 'age'
          />
          <Text style={styles.textDetail}>years</Text>
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
          onPress={this.onNextButtonPress}
        >
        {this.props.navigation === undefined ? (
          <Text style={{ color: "white", fontFamily: "System", fontWeight: "100" }} >
            Next
          </Text>
        ) : 
          <Text style={{ color: "white", fontFamily: "System", fontWeight: "100" }} >
            Save
          </Text>
           }
        </Button>
        {this.props.navigation === undefined ? (
            <TouchableOpacity
              style={styles.skipTouch}
              hitSlop={{ top: 5, bottom: 15, left: 15, right: 15 }}
              onPress={this.onSkipButtonPress}
            >
              <Text style={styles.skipText}>Skip this step for now</Text>
            </TouchableOpacity>
        ) : null }
        <StatusBar backgroundColor="#F53B91" />
      </KeyboardAvoidingView>
      </Image>
    );
  }
}));

const styles = StyleSheet.create({
  super: {},
  container: {
    flex: 1,
    alignSelf: "stretch",
    width: undefined,
    height: undefined,
    resizeMode: "cover"
  },
  text1: {
    marginTop: 164,
    marginLeft: 90,
    marginRight: 90,
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: 14
  },
  textDetail: {
    marginRight: 8,
    fontFamily: "System",
    fontWeight: "100",
    fontSize: 14
  },
  skipText: {
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "System",
    fontWeight: "100",
    fontSize: 14
  },
  skipTouch: { marginTop: 60, marginLeft: 90, marginRight: 90 }
});