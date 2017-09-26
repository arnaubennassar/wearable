/*@flow*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Image, FlatList, StatusBar, TouchableOpacity } from 'react-native';

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


const heart   = (<View style={{width: 55}}><Image style={{marginLeft: 15, marginTop:10, width:20, height:48, marginTop:10, marginRight:5}} resizeMode='stretch' source={require('../resources/images/termometer.png')}/></View>)
const moon    = (<View style={{width: 55}}><Icon style={{marginLeft: 5, marginTop: 15}} size={ 48 } name={ "moon-o" } color={ '#979797' }/></View>)
const runner  = (<View style={{width: 55}}><Image style={{marginLeft: 5, marginTop:10, width:40, height:48, marginTop:10}} resizeMode='stretch' source={require('../resources/images/runner.png')}/></View>)
const bground = require('../resources/images/B1.png');
class MainScreen extends Component {
    render() {
        return (
            <Image style={styles.container} source={bground} >
                <FlatList
                  data={ this.props.state.notifications }
                  keyExtractor={item => item.timeStamp }  //Piece of data that its unique for each element on the list!!!
                  renderItem={ ({ item }) => (
                    <TouchableOpacity
                      style={[styles.itemContainerRow, {height: 132, width:'80%', alignSelf:'center'}]}
                      onPress={ () => {  this.props.navigation.navigateWithDebounce("DetailScreen", {title: item.notification.headings.en, subtitle: item.notification.contents.en, fullDescription: item.notification.data.data.fullDescription, date:item.timeStamp})   } }
                    >
                      <View style={styles.itemContainerCol}>
                            {item.notification.data.icon == 'heart' ? heart : null}
                            {item.notification.data.icon == 'moon' ? moon : null}
                            {item.notification.data.icon == 'runner' ? runner : null}
                            <Text style={styles.itemDate}>{item.timeStamp}</Text>
                          </View>
                          
                          <View style={styles.itemContainerCol}>
                            <Text style={styles.itemTitle}>{item.notification.headings.en}</Text>
                            <Text style={styles.itemBody}>{item.notification.contents.en}</Text>
                          </View>
                    </TouchableOpacity>
                  )}
                />
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'stretch',
      width: undefined,
      height: undefined,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemContainerRow:{
      flexDirection: 'row',
      marginTop: 4,
      height:100,
      borderBottomWidth: 2,
      borderBottomColor: '#979797',
    },
    itemContainerCol:{
      flexDirection: 'column',
    },
    itemImage:{
      height:80,
      width:80,
      margin:10
    },
    itemTitle:{
      fontFamily: "System",
      fontSize: 24,
      color: '#B5B2B2',
      fontWeight:'900'
    },
    itemBody:{
      fontFamily: "System",
      fontSize: 14,
      color: '#B5B2B2',
      fontWeight:'100'
    },
    itemDate:{
      width: 60,
      marginTop:30,
      fontFamily: "System",
      fontSize: 12,
      color: '#B5B2B2',
      fontWeight:'100'
    }
});

//REDUX CONNECTION
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);