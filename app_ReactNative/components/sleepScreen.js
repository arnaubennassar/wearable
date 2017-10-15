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
export default class sleepScreen extends Component {
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
      for (var i = 0; i < this.props.navigation.state.params.sleepData[0].length; i++) {
        ticks[0][i] = this.props.navigation.state.params.sleepData[0][i].c;
        console.log(this.props.navigation.state.params.sleepData[0][i])
      };
      console.log(ticks)
      for (var i = 0; i < this.props.navigation.state.params.sleepData[1].length; i++) {
        ticks[1][i] = this.props.navigation.state.params.sleepData[0][i].c;
      };
      for (var i = 0; i < this.props.navigation.state.params.sleepData[2].length; i++) {
        ticks[2][i] = this.props.navigation.state.params.sleepData[0][i].c;
      };
      return (
        <Image style={styles.container} source={bground}>
           <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              height={hait}
              padding={{ top: 10, bottom: 30, left: 30, right: 10 }}
              domainPadding={{x: (wiz*0.6)/this.props.navigation.state.params.sleepData[rangeSelected].length, y: hait*0.1}}
            >
              <VictoryAxis 
                tickCount={Math.min(10, this.props.navigation.state.params.sleepData[rangeSelected].length)}
                tickFormat={(t) => new Date(ticks[rangeSelected][t-1]).getDate() + '/' + (new Date(ticks[rangeSelected][t-1]).getMonth()+1)} 
              />
              <VictoryAxis 
                dependentAxis
                tickCount={8}
                tickFormat={(t) => Math.floor(t / 3600000).toString() + 'h'}
                style={{ axis: {stroke: "#969696"}, grid: {stroke: (t) => (Math.floor(t / 3600000) == 8) ? "#B5B2B2" : "transparent"}, ticks: {stroke: "grey", size: 0} }} 
              />
              <VictoryBar
                labels={(d) => Math.floor(d.y/3600000).toString()+":"+Math.floor(((d.y-(Math.floor(d.y/3600000)/1000))%60)).toString()}
                domain={{y: [0, 57600000]}}//86400000 = 16*60*60*1000 = 16h
                style={{
                  parent: {
                    border: "1px solid #ccc"
                  },
                  data: {
                    fill: "#F53B91", stroke: "#F53B91", strokeWidth: 3, width: ((wiz*0.65)/(this.props.navigation.state.params.sleepData[rangeSelected].length) )
                  },
                  labels: {
                    fontSize: 15, fill: "#B5B2B2"
                  }
                }}
                data={ this.props.navigation.state.params.sleepData[rangeSelected] }
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

const lorem = "The healthy amount of sleep for the average adult is around seven to eight hours each night.  Researchers in the United Kingdom and Italy analyzed data from 16 separate studies conducted over 25 years, covering more than 1.3 million people and more than 100,000 deaths. They published their findings in the journal Sleep. Those who generally slept for less than six hours a night were 12 percent more likely to experience a premature death. People who slept more than eight to nine hours per night had an even higher risk, at 30 percent.  Researchers also found that people who reduced their sleep time from seven hours to five hours or less had 1.7 times the risk of death from all causes.";
//NavigationActions.reset({ index: 0, actions: [{type: NavigationActions.NAVIGATE, routeName: 'Login'}], key: null })