/*@flow*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, StatusBar, TouchableOpacity } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryPie, VictoryAnimation, VictoryLabel } from 'victory-native';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as userActions    from '../redux/actions/user';

import NavButtons from './NavButtons';

//REDUX CONNECTION
function mapStateToProps(state){return{
  state: {
    user: state.user.user,
    data: state.data.data,
  }
};};

function mapDispatchToProps(dispatch){return {
    actions: {
      user: bindActionCreators(userActions, dispatch),   
    }    
}};
//

class DashboardScreen extends Component {
    render() {
        return(
            <Image style={styles.container} source={require('../resources/images/B3.png')} >
                <TouchableOpacity
                  style={[styles.touch1, {height: 105}]}
                  onPress={ () => {} }
                >
                    <Text style={styles.t1}>MyBBT</Text>
                    <View style={styles.BBTChartContainer}>
                        <VictoryLine
                        domain={{x: [0, 6], y: [29, 41]}}
                        padding={0}
                        width={200}
                        height={50}
                        animate={{duration: 500, onLoad: {duration: 1000}}}
                        easing="linear"
                          style={{
                            data: { stroke: "#969696" },
                          }}
                          interpolation="natural"
                          data={ [
                            {x: 1, y: Math.random() * 10 + 30, key: 0},
                            {x: 2, y: Math.random() * 10 + 30, key: 1},
                            {x: 3, y: Math.random() * 10 + 30, key: 2},
                            {x: 4, y: Math.random() * 10 + 30, key: 3},
                            {x: 5, y: Math.random() * 10 + 30, key: 4}
                          ]}
                        />
                      <Text style={styles.t2}><Text style={{fontWeight:'900'}}>97.0</Text><Text style={{fontWeight:'100'}}> F</Text></Text>
                    </View>
                    <Image style={{width:20, height:48, marginTop:10, marginRight: 10}} source={require('../resources/images/termometer.png')} ></Image>
                </TouchableOpacity>


                <TouchableOpacity
                  style={[styles.touch1, {height: 132}]}
                  onPress={ () => {} }
                >
                  <View>
                    <Text style={styles.t1}>Your last sleep</Text>
                    <Image style={{width:150, height:66, marginTop:15}} source={require('../resources/images/moon.png')} ></Image>
                  </View>
                  <View style={{marginTop:34, marginLeft:20}}>
                    <Text style={styles.t3}><Text style={{fontWeight:'900'}}>8</Text><Text style={{fontWeight:'100'}}> h</Text></Text>
                    <Text style={styles.t3}><Text style={{fontWeight:'900'}}>12</Text><Text style={{fontWeight:'100'}}> min</Text></Text>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity
                  style={[styles.touch1, {height: 155}]}
                  onPress={ () => {} }
                >
                    <Image style={{width:48, height:57, marginTop:10}} source={require('../resources/images/termometer.png')} ></Image>
                    <View style={{marginLeft:30}}>
                      <VictoryPie
                        animate={{ duration: 500, onLoad: {duration: 1000}  }}
                        width={115} height={115} padding={0}
                        data={ [
                              {x: '75%', y: 75},
                              {x: ' ', y: 25}
                            ]}
                        innerRadius={38}
                        cornerRadius={25}
                        labelRadius={0.1}
                        style={{
                          marginTop:10,
                          data: { fill: (d) => {
                            const color = "#F9308A";
                            return d.x !== ' ' ? color : "transparent";
                          }},
                          labels: { fill: "#B5B2B2", fontSize: 20, fontWeight: "bold" }
                        }}
                      />
                      <Text style={styles.t1}>of daily exercise</Text>
                    </View>
                </TouchableOpacity>
            </Image>
            
        )
        /*
        

        return (
            <Image style={styles.container} source={require('../resources/images/splash.png')} >
                <StatusBar backgroundColor="#F53B91" barStyle="light-content" />
                <Text> Main </Text>
                <Button onPress={ () => this.props.navigation.navigateWithDebounce("BBTScreen") } title="Go to Detail" />
                <Button onPress={ () => this.props.actions.user.logout() } title="LOGOUT" />
            </Image>
        )
        */
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'stretch',
      width: undefined,
      height: undefined,
      resizeMode: 'cover',
    },
    col: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end' 
    },
    touch1: {
      flexDirection: 'row',
      marginTop: 4,
      marginHorizontal: 40,
      borderBottomWidth: 2,
      borderBottomColor: '#979797',
    },
    t1: {
      textAlign: "left",
      fontFamily: "System",
      fontWeight: "100",
      fontSize: 14,
      color: '#B5B2B2'
    },
    t2: {
      textAlign: "center",
      fontFamily: "System",
      fontSize: 30,
      color: '#B5B2B2'
    },
    t3: {
      textAlign: "center",
      fontFamily: "System",
      fontSize: 24,
      color: '#B5B2B2'
    },
    BBTChartContainer: {
      marginTop: 4,
      marginLeft: 0,
      width: 200,       //130
      height:50        //50
    },
    BBTChart: {
      width: "auto",       //130
      height:"auto" ,       //50
      padding:1000
    },
    diferente: {
    }
});

//REDUX CONNECTION
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);