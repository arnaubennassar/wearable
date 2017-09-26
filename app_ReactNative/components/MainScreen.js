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


const heart   = (<View style={{width: 55}}><Image style={{width:20, height:48, marginTop:10, marginRight:5}} resizeMode='stretch' source={require('../resources/images/termometer.png')}/></View>)
const moon    = (<View style={{width: 55}}><Icon style={{marginTop: 10}} size={ 48 } name={ "moon-o" } color={ '#979797' }/></View>)
const runner  = (<View style={{width: 55}}><Image style={{width:40, height:48, marginTop:10}} resizeMode='stretch' source={require('../resources/images/runner.png')}/></View>)
class MainScreen extends Component {
    componentWillMount(){
    //  sendNotification('test 8', "aqui una altre altre altre altre altre altre altre altrealtre altre altre altre altre altre altre altrealtre altre altre altre altre altre altre altrealtre altre altre altre altre altre altre altrealtre altre altre altre altre altre altre altre prova", 'runner', {fullDescription: "es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas Letraset, las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum"}, this.props.state.user.tokenAWS, (ans)=>{console.log(ans)});
    }
    render() {
        return (
            <Image style={styles.container} source={require('../resources/images/B1.png')} >
                <FlatList style={{ width:'80%'}} 
                  data={ this.props.state.notifications }
                  keyExtractor={item => item.timeStamp }  //Piece of data that its unique for each element on the list!!!
                  renderItem={ ({ item }) => (
                    <TouchableOpacity
                      style={[styles.itemContainerRow, {height: 132}]}
                      onPress={ () => {  this.props.navigation.navigateWithDebounce("DetailScreen")   } }
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