import React, { Component } from 'react';
import { View, Image, Text, ScrollView, Dimensions, StyleSheet, StatusBar} from 'react-native';
import { NavigationActions } from 'react-navigation';


const bground = require('../resources/images/B1.png');

const hait = Dimensions.get('window').height;
const wiz = Dimensions.get('window').width;

export default class DetailScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`
  });
  componentWillMount () {
    const setParamsAction = NavigationActions.setParams({
      params: { hideTabBar: true },
      key: 'HomeStack',
    });
    this.props.navigation.dispatch(setParamsAction);
  };
    render() {
      console.log(this);
        return (
            <Image style={styles.container} source={bground} >
              <View style={styles.margi}>
                <ScrollView contentContainerStyle={styles.scroll}>
                  <Text style={styles.subtitle}>{this.props.navigation.state.params.subtitle}</Text>
                  <Text style={styles.body}>{this.props.navigation.state.params.fullDescription}</Text>
                </ScrollView> 
                <Text style={styles.date}>{this.props.navigation.state.params.date}</Text>
              </View>
              <StatusBar backgroundColor="#F53B91" />
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
    subtitle:{
      backgroundColor:'transparent',
      marginHorizontal:'10%',
      fontFamily: "System",
      fontSize: hait*0.025,
      color: '#B5B2B2',
      fontWeight:'900'
    },
    date:{
      backgroundColor:'transparent',
      marginLeft:'60%',
      marginTop:30,
      fontFamily: "System",
      fontSize: hait*0.025,
      color: '#B5B2B2',
      fontWeight:'100',
    },
    body:{
      backgroundColor:'transparent',
      marginHorizontal:'10%',
      marginTop:30,
      fontFamily: "System",
      fontSize: hait*0.025,
      color: '#B5B2B2',
      fontWeight:'100'
    },
    margi:{
      marginVertical:'20%'
    }
});

