/*@flow*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, StatusBar, TouchableOpacity } from 'react-native';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as userActions    from '../redux/actions/user';
import * as BTActions    from '../redux/actions/BT';
import Icon from 'react-native-vector-icons/FontAwesome';

import NavButtons from './NavButtons';

//REDUX CONNECTION
function mapStateToProps(state){return{
  state: {
    user: state.user.user,
    BT: state.BT.BT,
  }
};};

function mapDispatchToProps(dispatch){return {
    actions: {
      user: bindActionCreators(userActions, dispatch),   
      BT: bindActionCreators(BTActions, dispatch),   
    }    
}};
//
const backgraun = require('../resources/images/B3.png');
class MainScreen extends Component {
    render() {

      return(
            <Image style={styles.container} source={backgraun} >
                <TouchableOpacity
                  style={[styles.touch1, {height: 132}]}
                  onPress={ () =>  this.props.navigation.navigateWithDebounce("PersonalDataScreen", {tokenAWS:this.props.state.user.tokenAWS, height:this.props.state.user.height, weight:this.props.state.user.weight, age:this.props.state.user.bday, actions:this.props.actions.user} ) }
                >
                    <View style={{flexDirection: 'row', flex:1}}>
                    <Text style={styles.t1}>Edit personal data</Text>
                    <View style={{width: '10%',}} />
                    {personalDataIcon}
                  </View>
                </TouchableOpacity>


                <TouchableOpacity
                  style={[styles.touch1, {height: 132}]}
                  onPress={ () => { this.props.navigation.navigateWithDebounce("BTScreen", {actions:this.props.actions.BT, state:this.props.state.BT} ) } } 
                >
                  <View style={{flexDirection: 'row', flex:1}}>
                    {wearableIcon}
                    <View style={{width: '25%'}} />
                    <Text style={styles.t1}>Connect to wearable</Text>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity
                  style={[styles.touch1, {height: 132}]}
                  onPress={ () => { this.props.actions.user.logout() }  } 
                >
                  <View style={{flexDirection: 'row', flex:1}}>
                    <Text style={styles.t1}>Logout</Text>
                    <View style={{width: '10%',}} />
                    {logoutIcon}
                  </View>
                </TouchableOpacity>
            </Image>
            );
        
    }
}

const personalDataIcon = (<Icon style={{marginTop: 40}} size={ 130 } name={ "cog" } color={ '#B5B2B2' }/>);
const wearableIcon = (<Icon style={{marginTop: 40}} size={ 130 } name={ "bluetooth-b" } color={ '#B5B2B2' }/>);
const logoutIcon = (<Icon style={{marginTop: 40}} size={ 130 } name={ "power-off" } color={ '#B5B2B2' }/>);
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'stretch',
      width: undefined,
      height: undefined,
      resizeMode: 'cover',
    },
    touch1: {
      marginTop: 4,
      marginHorizontal: 40,
      borderBottomWidth: 2,
      borderBottomColor: '#979797',
    },
    t1: {
      marginTop: 50,
      width: '48%',
      textAlign: "left",
      fontFamily: "System",
      fontWeight: "100",
      fontSize: 16,
      color: '#B5B2B2'
    },
    image:{
      width:150,
      height:150,
    }
});

//REDUX CONNECTION
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);