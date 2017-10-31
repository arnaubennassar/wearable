/*@flow*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, StatusBar, TouchableOpacity, Dimensions, Platform } from 'react-native';
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


const bground = require('../resources/images/ba2.png');
const hait = Dimensions.get('window').height;
const wiz = Dimensions.get('window').width;
var iosMargin = 0;
if(Platform.OS === 'ios') {
  iosMargin = hait*0.1;
}
const termometer = <Image style={{width:wiz*0.05, height:hait*0.08, marginTop:hait*0.0225, marginLeft: wiz*0.0625, resizeMode:'stretch'}}  source={require('../resources/images/termometer.png')} ></Image>;
const moon = (<Image style={{width:wiz*0.4, height:hait*0.106, marginTop:hait*0.03, resizeMode:'stretch'}}  source={require('../resources/images/moon.png')} ></Image> );
const runner = (<Image style={{width:wiz*0.1123, height:hait*0.0925, marginTop:10, resizeMode:'stretch'}}  source={require('../resources/images/runner.png')} ></Image>);

class DashboardScreen extends Component {
    render() {
    //BBT
      var len = 0;
      var temp = '-';
      var acti = 0;
      var week_b = [];
      var month_b = [];
      var all_b = [];
      var iWeek_b = 0;
      var iMonth_b = 0;
      const now = Date.parse(new Date());
   //   console.log(this.props.state);
      for (var i = 0; i < this.props.state.data.BBT.length; i++) {
        current = this.props.state.data.BBT[i];
        if(now - current.c < 604800000 ){  //7*24*60*60*1000 = 1 week in ms
          week_b[iWeek_b] = {x: current.c, y:current.v};
          ++iWeek_b;
        }        
        if(now - current.c < 2592000000){  //30*24*60*60*1000 = 1 month in ms
          month_b[iMonth_b] = {x: current.c, y:current.v};
          ++iMonth_b;
        }        
        all_b[i] = {x: current.c, y:current.v};
      };
      var _BBTData = [week_b, month_b, all_b];
    //SLEEP
      var week_s = [];
      var month_s = [];
      var all_s = [];
      var iWeek_s = 0;
      var iMonth_s = 0;
      for (var i = 0; i < this.props.state.data.sleep.length; i++) {
        current = this.props.state.data.sleep[i];
        if(current != null){
          if(now - current.c < 604800000){  //7*24*60*60*1000 = 1 week in ms
            week_s[iWeek_s] = {x: i+1, c: current.c, y:current.v};
            ++iWeek_s;
          }        
          if(now - current.c < 2592000000){  //30*24*60*60*1000 = 1 month in ms
            month_s[iMonth_s] = {x: i+1, c: current.c, y:current.v};
            ++iMonth_s;
          }        
          all_s[i] = {x: i+1, c: current.c, y:current.v};
        }
      };
      var _sleepData = [week_s, month_s, all_s];

    //ACTIVITY
      var week_a = [];
      var month_a = [];
      var all_a = [];
      var iWeek_a = 0;
      var iMonth_a = 0;
      var _objective = this.props.state.data.activityObjective;
      for (var i = 0; i < this.props.state.data.dailyActivity.length; i++) {
        current = this.props.state.data.dailyActivity[i];
        if(current != null){
          if(now - current.c < 604800000){  //7*24*60*60*1000 = 1 week in ms
            week_a[iWeek_a] = {x: i+1, c: current.c, y:current.v/_objective};
            ++iWeek_a;
          }        
          if(now - current.c < 2592000000){  //30*24*60*60*1000 = 1 month in ms
            month_a[iMonth_a] = {x: i+1, c: current.c, y:current.v/_objective};
            ++iMonth_a;
          }        
          all_a[i] = {x: i+1, c: current.c, y:current.v/_objective};
        }
      };
      
  //////      FAKE DATA   ////
      // week_b = [{x:1507992980000, y: 36.4}, {x:1507474580000, y: 37}, {x:1507560980000, y: 37.3}, {x:1507647380000, y: 36.8}, {x:1507733780000, y: 36.5}, {x: 1507906580000, y: 35}, {x: 1507992980000, y: 36.8}];
      // // month_b = [{x: 1506874513000, y: 38}, {x: 1506960913000, y: 35}, {x: 1507047313000, y: 41}, {x: 1507133713000, y: 35.5} ];
      // // all_b   = [{x: 1506874513000, y: 38}, {x: 1506960913000, y: 35}, {x: 1507047313000, y: 41}, {x: 1507133713000, y: 35.5} ];
      // var _BBTData = [week_b, month_b, all_b];

      // week_s  = [{x: 1, c:1507992980000, y: 28000000}, {x: 2, c:1507474580000, y: 24000000}, {x: 3, c:1507560980000, y: 24500000}, {x: 4, c:1507647380000, y: 40000000}, {x: 5, c:1507733780000, y: 45800000}, {x: 6, c: 1507906580000, y: 12000000}, {x: 7, c: 1507992980000, y: 28000000}];
      // // month_s = [{x: 1, y: 7000000}, {x: 2, y: 28000000}, {x: 3, y: 8200000}, {x: 4, y: 55500000}, {x: 5, y: 7000000}, {x: 6, y: 28000000}, {x: 7, y: 8200000}, {x: 8, y: 55500000},{x: 9, y: 7000000}, {x: 10, y: 28000000}, {x: 11, y: 8200000}, {x: 12, y: 55500000}, {x: 13, y: 7000000}, {x: 14, y: 28000000}, {x: 15, y: 8200000}, {x: 16, y: 55500000}, {x: 17, y: 28000000} ];
      // // all_s   = [{x: 1, y: 7000000}, {x: 2, y: 28000000}, {x: 3, y: 8200000}, {x: 4, y: 55500000} ];
      // var _sleepData = [week_s, month_s, all_s];

      // week_a  = [{x: 1, c:1507992980000, y: 0.7}, {x: 2, c:1507474580000, y: 0.8}, {x: 3, c:1507560980000, y: 0.5}, {x: 4, c:1507647380000, y: 0.9}, {x: 5, c:1507733780000, y: 0.45}, {x: 6, c: 1507906580000, y: 0.72}, {x: 7, c: 1507992980000, y: 0.23}];
      // // month_a = [{x: 1, y: 7000000}, {x: 2, y: 28000000}, {x: 3, y: 8200000}, {x: 4, y: 55500000}, {x: 5, y: 7000000}, {x: 6, y: 28000000}, {x: 7, y: 8200000}, {x: 8, y: 55500000},{x: 9, y: 7000000}, {x: 10, y: 28000000}, {x: 11, y: 8200000}, {x: 12, y: 55500000}, {x: 13, y: 7000000}, {x: 14, y: 28000000}, {x: 15, y: 8200000}, {x: 16, y: 55500000}, {x: 17, y: 28000000} ];
      // // all_a   = [{x: 1, y: 7000000}, {x: 2, y: 28000000}, {x: 3, y: 8200000}, {x: 4, y: 55500000} ];
      // var _activityData = [week_s, month_s, all_s];

              /////
      var _activityData = [week_a, month_a, all_a];
      var sleepHours = 0; 
      var sleepMinutes = 0;
      if(all_s[0] != undefined){
        sleepHours = Math.floor(all_s[all_s.length-1].y /3600000); 
        sleepMinutes = Math.floor(((all_s[all_s.length-1].y-(Math.floor(all_s[all_s.length-1].y/3600000)/1000))%60));
      }
      if (all_b.length > 0){
        temp = (all_b[all_b.length -1].y).toFixed(2);
      }
      if (all_a.length > 0){
        acti = all_a[all_a.length -1].y *100;
        acti = Math.floor(acti);
      }
      // console.log(all_a)
      // console.log(all_s)
      // console.log(all_b)
      // console.log(month_a)
      // console.log(month_s)
      // console.log(month_b)
      // console.log(week_a)
      // console.log(week_b)
      // console.log(week_s)


        return(
            <Image style={styles.container} source={bground} >
                <View style={{height: iosMargin}} />
                <TouchableOpacity
                  style={[styles.touch1, {flexDirection: 'row'}]}
                  onPress={ () => { this.props.navigation.navigateWithDebounce("BBTScreen", {BBTData: _BBTData}) } }
                >
                    <Text style={styles.t1}>My BBT</Text>
                    <View style={styles.BBTView}>
                      <View style={styles.BBTChartContainer}>
                          <VictoryLine
                            domain={{y: [34, 42]}}
                            padding={0}
                            width={wiz*0.35}
                            height={hait*0.105}
                              style={{
                                data: { stroke: "#969696", strokeWidth: hait*0.005 },
                              }}
                              interpolation="cardinal"
                              data= {week_b}
                          />
                      </View>
                      <View style={styles.t2View}>
                        <Text style={styles.t2}>
                          <Text style={{fontWeight:'900'}}>{temp}</Text>
                          <Text style={{fontWeight:'100'}}> Cº</Text>
                        </Text>
                      </View>
                    </View>
                    {termometer}
                </TouchableOpacity>


                <TouchableOpacity
                  style={[styles.touch1, {flexDirection: 'row'}]}
                  onPress={ () => { this.props.navigation.navigateWithDebounce("sleepScreen", {sleepData: _sleepData}) } }
                >
                  <View style={styles.moon}>
                    <Text style={styles.t4}>Your last sleep</Text>
                    {moon}
                  </View>
                  <View style={styles.sleep}>
                    <Text style={styles.t3}><Text style={{fontWeight:'bold'}}>{sleepHours}</Text><Text style={{fontWeight:'100'}}> h</Text></Text>
                    <Text style={styles.t3}><Text style={{fontWeight:'bold'}}>{sleepMinutes}</Text><Text style={{fontWeight:'100'}}> min</Text></Text>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity
                  style={[styles.touch1, {flexDirection: 'row'}]}
                  onPress={ () => { this.props.navigation.navigateWithDebounce("activityScreen", {activityData: _activityData, objective: _objective}) } }
                >
                    {runner}
                    <View style={styles.exercise}>
                      <VictoryPie
                        width={hait*0.15} height={hait*0.15} padding={0}
                        data={ [
                              {x: '  ', y: acti},
                              {x: ' ', y: 100 - acti}
                            ]}
                        innerRadius={hait*0.055}
                        cornerRadius={hait*0.04}
                        style={{
                          data: { fill: (d) => {
                            const color = "#F9308A";
                            return d.x !== ' ' ? color : "transparent";
                          }},
                        }}
                      />
                      <Text style={styles.t5}>Of daily exercise</Text>
                    </View>
                    <View style={styles.percent}><Text style={[styles.t2, {fontWeight:'bold'}]}>{acti}%</Text></View>
                </TouchableOpacity>
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
    },
    col: {
      backgroundColor: 'transparent',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end' 
    },
    touch1: {
      backgroundColor: 'transparent',
      height:'27%',
      marginTop: '0.3%',
      marginHorizontal: '15%',
      borderBottomWidth: 2,
      borderBottomColor: '#979797',
    },
    t1: {
      backgroundColor: 'transparent',
      width:'25%',
      textAlign: "left",
      fontFamily: "System",
      fontWeight: "100",
      fontSize: hait*0.022,
      color: '#B5B2B2'
    },
    t2: {
      backgroundColor: 'transparent',
      textAlign: "center",
      fontFamily: "System",
      fontSize: hait*0.04,
      color: '#B5B2B2'
    },
    t2View: {
      backgroundColor: 'transparent',
      height:'35%',
      marginTop:'5%',
    },
    t3: {
      backgroundColor: 'transparent',
      textAlign: "center",
      fontFamily: "System",
      fontSize: hait*0.04,
      color: '#B5B2B2'
    },
    t4: {
      backgroundColor: 'transparent',
      fontFamily: "System",
      fontSize: hait*0.02,
      color: '#B5B2B2'
    },
    t5: {
      backgroundColor: 'transparent',
      textAlign: "center",
      fontFamily: "System",
      fontSize: hait*0.018,
      color: '#B5B2B2',
      marginTop: '3%'
    },
    BBTView:{
      backgroundColor: 'transparent',
      flexDirection: 'column',
      width: '50%',       //130
      height:'100%', 
    },
    BBTChartContainer: {
      backgroundColor: 'transparent',
      width: '100%',       //130
      height:'50%',        //50
    },
    BBTChart: {
      backgroundColor: 'transparent',
      width: "auto",       //130
      height:"auto" ,       //50
      padding:1000
    },
    diferente: {
    },
    moon:{
      backgroundColor: 'transparent',
      width: '60%',
      height: '100%',
    },
    sleep:{
      backgroundColor: 'transparent',
      width: '40%',
      height: '100%',
      marginTop: hait*0.05,
    },
    exercise: { 
      backgroundColor: 'transparent',
      flexDirection: 'column',
      alignItems:'center',
      marginTop:'4%',
      width:wiz*0.48,
    },
    percent: { 
      backgroundColor: 'transparent',
      position: 'absolute',
      alignSelf:'center',
      width: '100%',
      height: hait*0.08,
    }
});

//REDUX CONNECTION
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);