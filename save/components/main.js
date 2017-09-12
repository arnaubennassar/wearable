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
import * as userActions from '../redux/actions/user';

import * as api from '../buissLogic/api';
import {login, silentLogin} from '../buissLogic/AWSLogin';

function mapStateToProps(state){ return{ state: state } }
function mapDispatchToProps(dispatch){ return{ actions: bindActionCreators( userActions, dispatch ) } }

var counter = 0


var Main = React.createClass({
  componentDidMount() {
  	console.log('component did mount');
  },
  // componentWillUpdate(){
  // 	++counter;
  // }
  componentDidUpdate(){
  	console.log('componentDidUpdate');
  	try {
	  	if (this.props.state.user.user.hasPendings && this.props.state.user.user.validCredentials){
	  		console.log('goin for the pendings ');
	  		newStatePendings = this.props.state.user.user.pendingActions;
	  		for (var i = 0; i < newStatePendings.length; i++) {
	  			++counter;
	  			var params = newStatePendings[i].params;
			    switch(newStatePendings[i].function){
			      case "getHeartData":
			        api.getHeartData(this.props.state.user.user.tokenAWS, params.next);
			      break;
			      case 'postOSID':
			      	api.postOSID(this.props.state.user.user.tokenAWS, params.OS);
			      break
			      case 'postHeartData':
			      	api.postHeartData(this.props.state.user.user.tokenAWS, params.timeStamp, params.value);
			      break
	    		}
			};
			this.props.actions.cleanPendings();
	  	}
	  	else if (!this.props.state.user.user.validCredentials && this.props.state.user.user.loggedIn && !this.props.state.user.user.loadingLogin){
	  		silentLogin(this.props.state.user.user.email, this.props.state.user.user.password);
	  	}
  	}
  	catch(e){
  		console.log(e);
  	}
  },
  componentWillReciveProps(){
  	console.log('componentWillReciveProps');
  },
  onLoginButtonPress(){
    login('client1', '12345678');
  },
  onLogoutButtonPress(){
    this.props.actions.logout();
  },
  onTrollButtonPress(){
    api.getHeartData('trolololololololol');
  },
  render(){
  	if(!this.props.state.user.user.loggedIn)
    {
      return(
        <View style={styles.container}>
          <TouchableHighlight style={styles.button} onPress={this.onLoginButtonPress}>
            <Text style={styles.text}>Log In</Text>
          </TouchableHighlight>
            <Text style={styles.text}>{counter}</Text>
        </View>
      );
    }
    else{
      return(
        <View style={styles.container}>
          <TouchableHighlight style={styles.button} onPress={this.onLogoutButtonPress}>
            <Text style={styles.text}>LOGOUT</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.onTrollButtonPress}>
            <Text style={styles.text}>trolololololololo</Text>
          </TouchableHighlight>
            <Text style={styles.text}>{counter}</Text>
        </View>
      );
    }
/*
    if (this.props.state.data.data.loadingHeartData){
      Data.getHeartData(heartData);
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
  */
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);
