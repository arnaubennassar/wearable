/*@flow*/

import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/userActions';
import * as Data from '../../buissLogic/storage';

function mapStateToProps(state){return{state: state};}
function mapDispatchToProps(dispatch){return{actions: bindActionCreators(Actions, dispatch)}}

const heartData: Array<Object> = [];


var Login = React.createClass({
  onLoginButtonPress(){
    this.props.actions.login({name: 'tato',password: 'sole'});
  },
  onLogoutButtonPress(){
    this.props.actions.logout();
  },

  render(){

    if (this.props.state.data.data.loadingHeartData){
      Data.getHeartData(heartData);
    }
    if(!this.props.state.user.user.loggedIn)
    {
      return(
        <View style={styles.container}>
          <TouchableHighlight style={styles.button} onPress={this.onLoginButtonPress}>
            <Text style={styles.text}>Log In</Text>
          </TouchableHighlight>
        </View>
      );
    }
    if(this.props.state.data.data.fetchedHeartData){
      return(
        <View style={styles.container}>
          {heartData.map(function(moh, i) {
            return (<View key={i}><Text style={styles.text}>{moh.bpm}</Text></View>)
          })}
        </View>
      );
    }
    else{
      return(
        <View style={styles.container}>
          <Text style={styles.text}>Current heart beat: {this.props.state.data.data.heart}</Text>
            <TouchableHighlight style={styles.button} onPress={this.onLogoutButtonPress}>
              <Text style={styles.text}>LOGOUT</Text>
            </TouchableHighlight>
        </View>
      );
    }
  },
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, .10)',
    borderColor: 'rgba(255, 255, 255, .75)',
    borderWidth: 2,
    borderRadius: 50,
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
