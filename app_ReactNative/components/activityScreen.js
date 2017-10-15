import React, { Component } from 'react';
import { Image, View, Text, Dimensions, ScrollView, StyleSheet, StatusBar} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from 'victory-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const bground = require('../resources/images/ba2.png');
var rangeSelector = [
  {label: 'Last week',  value: 0 },
  {label: 'Last month', value: 1 },
  {label: 'All records', value: 2 },
];
var rangeSelected = 0;
const hait = Dimensions.get('window').height * 0.35;
const wiz = Dimensions.get('window').width;
export default class activityScreen extends Component {
  // static navigationOptions = {
  //   title: 'Detail',
  //   headerTintColor: '#1A1047',
  // };
  componentWillMount () {
    const setParamsAction = NavigationActions.setParams({
      params: { hideTabBar: true },
      key: 'HomeStack',
    });
    this.props.navigation.dispatch(setParamsAction);
  };

  render() {
//    
      var ticks = []
      ticks[0] = []
      ticks[1] = []
      ticks[2] = []
      for (var i = 0; i < this.props.navigation.state.params.activityData[0].length; i++) {
        ticks[0][i] = this.props.navigation.state.params.activityData[0][i].c;
        console.log(this.props.navigation.state.params.activityData[0][i])
      };
      console.log(ticks)
      for (var i = 0; i < this.props.navigation.state.params.activityData[1].length; i++) {
        ticks[1][i] = this.props.navigation.state.params.activityData[0][i].c;
      };
      for (var i = 0; i < this.props.navigation.state.params.activityData[2].length; i++) {
        ticks[2][i] = this.props.navigation.state.params.activityData[0][i].c;
      };
      return (
         <Image style={styles.container} source={bground}>
           <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              height={hait}
              padding={{ top: 10, bottom: 30, left: 10, right: 10 }}
              domainPadding={{x: (wiz*0.6)/this.props.navigation.state.params.activityData[rangeSelected].length, y: hait*0.1}}
            >
              <VictoryAxis 
                tickCount={Math.min(8, this.props.navigation.state.params.activityData[rangeSelected].length)} 
                tickFormat={(t) => new Date(ticks[rangeSelected][t-1]).getDate() + '/' + (new Date(ticks[rangeSelected][t-1]).getMonth()+1)} 
              />
              <VictoryBar
                domain={{y: [0, 1]}}//86400000 = 16*60*60*1000 = 16h
                style={{
                  parent: {
                    border: "1px solid #ccc"
                  },
                  data: {
                    fill: "#F53B91", stroke: "#F53B91", strokeWidth: 3, width: ((wiz*0.65)/(this.props.navigation.state.params.activityData[rangeSelected].length) )
                  },
                  labels: {
                    fontSize: 15, fill: "#B5B2B2"
                  }
                }}
                data={ this.props.navigation.state.params.activityData[rangeSelected] }
              />
            </VictoryChart>
          </View>

            
          <View style={{alignSelf:'center', alignContent:'center'}}>
            <RadioForm
              radio_props={rangeSelector}
              initial={0}
              onPress={(value) => { rangeSelected = value; this.forceUpdate();} }
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={"#F53B91"}
              labelColor={'#686464'}
              animation={true}
              buttonSize={5}
              buttonOuterSize={20}
              style={{backgroundColor: 'transparent'}}
            />
          </View>
          <View style={styles.scroll}>
            <ScrollView >
              <Text style={styles.body}>{lorem}</Text>
            </ScrollView> 
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
    },
    chartContainer: {
      backgroundColor: 'transparent',
        marginTop: 0,
        width:'100%',
        height: hait
    },

    scroll: {
      backgroundColor: 'transparent',
        marginTop: '5%',
        height: '45%',
    },
    body:{
      backgroundColor: 'transparent',
      marginHorizontal:'10%',
      fontFamily: "System",
      fontSize: 18,
      color: '#686464',
      fontWeight:'100'
    }
});

const lorem = "For most healthy adults, the Department of Health and Human Services recommends these exercise guidelines:  Aerobic activity. Get at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous aerobic activity a week, or a combination of moderate and vigorous activity. The guidelines suggest that you spread out this exercise during the course of a week. Strength training. Do strength training exercises for all major muscle groups at least two times a week. Aim to do a single set of each exercise, using a weight or resistance level heavy enough to tire your muscles after about 12 to 15 repetitions. Moderate aerobic exercise includes activities such as brisk walking, swimming and mowing the lawn. Vigorous aerobic exercise includes activities such as running and aerobic dancing. Strength training can include use of weight machines, your own body weight, resistance tubing, resistance paddles in the water, or activities such as rock climbing.  As a general goal, aim for at least 30 minutes of physical activity every day. If you want to lose weight or meet specific fitness goals, you may need to exercise more. Want to aim even higher? You can achieve more health benefits, including increased weight loss, if you ramp up your exercise to 300 minutes a week.  Reducing sitting time is important, too. The more hours you sit each day, the higher your risk of metabolic problems, even if you achieve the recommended amount of daily physical activity.  Short on long chunks of time? Even brief bouts of activity offer benefits. For instance, if you can't fit in one 30-minute walk, try three 10-minute walks instead. What's most important is making regular physical activity part of your lifestyle.";
//NavigationActions.reset({ index: 0, actions: [{type: NavigationActions.NAVIGATE, routeName: 'Login'}], key: null })