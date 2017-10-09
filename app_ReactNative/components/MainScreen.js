/*@flow*/
import React, { Component } from 'react';
import { View, Platform, Text, StyleSheet, ActivityIndicator, Button, Image, FlatList, StatusBar, TouchableOpacity, Dimensions } from 'react-native';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as userActions    from '../redux/actions/user';

import NavButtons from './NavButtons';
import Icon from 'react-native-vector-icons/FontAwesome';



import {sendNotification} from '../buissLogic/api'
//REDUX CONNECTION
function mapStateToProps(state){return{
  state: {
    notifications: state.notifications.notifications,
    user: state.user.user
  }
};};

function mapDispatchToProps(dispatch){return {
    actions: {
      user: bindActionCreators(userActions, dispatch),   
    }    
}};


const hait = Dimensions.get('window').height;
const wiz = Dimensions.get('window').width;
var iosMargin = 0;
if(Platform.OS === 'ios') {
  iosMargin = hait*0.1;
}
const moon =      (<Icon style={{backgroundColor: 'transparent', marginLeft: 5, marginTop: 15}} size={ wiz*0.14 } name={ "moon-o" } color={ '#979797' }/>)
const heart =     (<Icon style={{backgroundColor: 'transparent', marginBottom: hait*0.01}} size={ wiz*0.12 } name={ "heart" } color={ '#979797' }/>)
const user =      (<Icon style={{backgroundColor:'transparent'}} size={ wiz*0.14 } name={ "user" } color={ '#979797' }/>)
const bluetooth = (<Icon style={{backgroundColor:'transparent'}} size={ wiz*0.14 } name={ "bluetooth-b" } color={ '#979797' }/>)
const runner = (<Image style={{backgroundColor:'transparent', width:wiz*0.12, height:wiz*0.14}} resizeMode='stretch' source={require('../resources/images/runner.png')}/>)
const bground = require('../resources/images/ba1.png');
class MainScreen extends Component {
    render() {
        return (
            <Image style={styles.container} source={bground} >
                <View style={{height: iosMargin}} />
                <FlatList
                  data={ this.props.state.notifications }
                  keyExtractor={item => item.timeStamp }  //Piece of data that its unique for each element on the list!!!
                  renderItem={ ({ item }) => (
                        <TouchableOpacity
                          style={styles.itemContainerRow}
                          onPress={ () => {  this.props.navigation.navigateWithDebounce("DetailScreen", {title: item.notification.headings.en, subtitle: item.notification.contents.en, fullDescription: item.notification.data.data.fullDescription, date:item.timeStamp})   } }
                        >
                          <View style={styles.itemContainerCol1}>
                                {item.notification.data.icon == 'heart' ? heart : null}
                                {item.notification.data.icon == 'moon' ? moon : null}
                                {item.notification.data.icon == 'user' ? user : null}
                                {item.notification.data.icon == 'runner' ? runner : null}
                                {item.notification.data.icon == 'bluetooth' ? bluetooth : null}
                                <Text style={styles.itemDate}>{item.timeStamp}</Text>
                          </View>
                              
                          <View style={styles.itemContainerCol2}>
                                <Text style={styles.itemTitle}>{item.notification.headings.en}</Text>
                                <Text style={styles.itemBody}>{item.notification.contents.en}</Text>
                          </View>

                        </TouchableOpacity>
                  )}
                />
                <StatusBar backgroundColor="#F53B91" />
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    itemContainerRow:{
      flexDirection: 'row',
      width:'70%', 
      alignSelf:'center',
      marginTop: '1%',
      height:hait*0.21,
      borderBottomWidth: 2,
      borderBottomColor: '#979797',
    },
    itemContainerCol1:{
      flexDirection: 'column',
      width: '20%',
      alignItems:'center',
      marginTop:'5%'
    },
    itemContainerCol2:{
      flexDirection: 'column',
      width: '70%',
      marginLeft: '7%',
    },
    itemTitle:{
      backgroundColor: 'transparent',
      fontFamily: "System",
      fontSize: hait*0.04,
      color: '#B5B2B2',
      fontWeight:'900'
    },
    itemBody:{
      backgroundColor: 'transparent',
      fontFamily: "System",
      fontSize: hait*0.02,
      color: '#B5B2B2',
      fontWeight:'100',
      marginTop:'5%'
    },
    itemDate:{
      backgroundColor: 'transparent',
      height:'100%',
      width: '100%',
      marginTop:30,
      fontFamily: "System",
      fontSize: hait*0.015,
      color: '#B5B2B2',
      fontWeight:'100',
    }
});

//REDUX CONNECTION
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);