/*@flow*/
// REACT
import React, { Component } from 'react';
import { View, Text, Image, StatusBar, StyleSheet} from 'react-native';
//
// BUISSNESS LOGIC
import initStorage from '../buissLogic/initStorage';
//
// INIT APP CONTROL VARIABLES
var storage = false;
//
export default SplashScreen = React.createClass({
//INITIALIZE APP LOGIC HERE
    componentWillMount () {
      initStorage(this.storageInitialized);       
    },
    storageInitialized(){
      storage = true;
      this.checkInit();
    },
    checkInit (){
      if (storage /* && xxxx && yyyy*/){
        this.props.complete();
      }
    },
//
//UPDATE COMPONENT UI?
    shouldComponentUpdate(nextProps, nextState){
      return true;
    },
//
//RENDER THE UI
    render() {
        return (
          <Image
            style={styles.image}
            source={require('../resources/images/splash.png')}
          >
              <StatusBar
               backgroundColor="#F53B91"
               barStyle="light-content"
             />
          </Image >
        )
    }
});
//
//"CSS"
const styles = StyleSheet.create({
  image: {
    flex: 1,
    alignSelf: 'stretch',
    width: undefined,
    height: undefined,
    resizeMode: 'cover'
  }
});
//