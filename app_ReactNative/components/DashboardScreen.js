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
  //  user: state.user.user,
    data: state.data.data,
  }
};};

function mapDispatchToProps(dispatch){return {
    actions: {
      user: bindActionCreators(userActions, dispatch),   
    }    
}};
//
const moon = (<Image style={{width:150, height:66, marginTop:15}} source={require('../resources/images/moon.png')} ></Image> );
const runner = (<Image style={{width:48, height:57, marginTop:10}} source={require('../resources/images/runner.png')} ></Image>);
const termometer = <Image style={{width:20, height:48, marginTop:10, marginLeft: 30}} source={require('../resources/images/termometer.png')} ></Image>;
const bground = require('../resources/images/B2.png');
class DashboardScreen extends Component {
    
    render() {
      var len = 0;
      var temp = '-';
      var acti = 0;
      if (this.props.state.data.temperature.length > 0){
        len = this.props.state.data.temperature.length;
        sum = 0;
        for (var i = 0; i < this.props.state.data.temperature.length; i++) {
          sum += this.props.state.data.temperature[i].v;
        };
        temp = sum / len;
      }
      if (this.props.state.data.dailyActivity !== undefined){
        acti = (this.props.state.data.dailyActivity / this.props.state.data.activityObjective) * 100;
      }
        return(
            <Image style={styles.container} source={bground} >
                <TouchableOpacity
                  style={[styles.touch1, {height: 132}]}
                  onPress={ () => {} }
                >
                  <View style={{flexDirection:'column'}}>
                    <Text style={styles.t1}>MyBBT</Text>
                    <View style={styles.BBTChartContainer}>
                        <VictoryLine
                        domain={{y: [22, 30]}}
                        padding={0}
                        width={175}
                        height={70}
                        animate={{duration: 500, onLoad: {duration: 1000}}}
                        easing="linear"
                          style={{
                            data: { stroke: "#969696" },
                          }}
                          interpolation="natural"
                          data= {(len < 5) ? null : [
                            {x: 1/*this.props.state.data.temperature[len - 4].c*/, y: this.props.state.data.temperature[len - 4].v},
                            {x: 2/*this.props.state.data.temperature[len - 3].c*/, y: this.props.state.data.temperature[len - 3].v},
                            {x: 3/*this.props.state.data.temperature[len - 2].c*/, y: this.props.state.data.temperature[len - 2].v},
                            {x: 4/*this.props.state.data.temperature[len - 1].c*/, y: this.props.state.data.temperature[len - 1].v},
                          ]}
                        />
                      <Text style={styles.t2}><Text style={{fontWeight:'900'}}>{temp}</Text><Text style={{fontWeight:'100'}}> Cº</Text></Text>
                    </View>
                  </View>
                    {termometer}
                </TouchableOpacity>


                <TouchableOpacity
                  style={[styles.touch1, {height: 132}]}
                  onPress={ () => {} }
                >
                  <View>
                    <Text style={styles.t1}>Your last sleep</Text>
                    {moon}
                  </View>
                  <View style={{marginTop:34, marginLeft:20}}>
                    <Text style={styles.t3}><Text style={{fontWeight:'900'}}>8</Text><Text style={{fontWeight:'100'}}> h</Text></Text>
                    <Text style={styles.t3}><Text style={{fontWeight:'900'}}>12</Text><Text style={{fontWeight:'100'}}> min</Text></Text>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity
                  style={[styles.touch1, {height: 132}]}
                  onPress={ () => {} }
                >
                    {runner}
                    <View style={{marginLeft:40}}>
                      <VictoryPie
                        width={110} height={110} padding={0}
                        data={ [
                              {x: Math.round(acti).toString() + '%', y: acti},
                              {x: ' ', y: 100 - acti}
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
                    <Text style={[styles.t1, {marginBottom:5}]}>of daily exercise</Text>
                    </View>
                </TouchableOpacity>
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
      marginTop: 2,
      marginLeft: 50,
      width: 175,       //130
      height:70        //50
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