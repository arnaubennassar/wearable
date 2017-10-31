import React, { Component } from 'react';
import { View, Image, Text, Dimensions, ScrollView, StyleSheet, StatusBar} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const bground = require('../resources/images/ba2.png');
var rangeSelector = [
  {label: 'Last week',  value: 0 },
  {label: 'Last month', value: 1 },
  {label: 'All records', value: 2 },
];
var rangeSelected = 0;
const hait = Dimensions.get('window').height * 0.45;
export default class BBTScreen extends Component {
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
      return (
         <Image style={styles.container} source={bground}>
           <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              height={hait}
              padding={{ top: 10, bottom: 30, left: 10, right: 10 }}
            >
              <VictoryAxis 
                tickCount={12} 
                tickFormat={(t) => new Date(t).getDate() + '/' + (new Date(t).getMonth()+1)}
                style={{ axis: {stroke: "#969696"}, grid: {stroke: (t) => (t  == 1507900000000) ? "#F53B91" : "transparent"} }}
              />
              <VictoryLine
                interpolation="natural"
                domain={{y: [34, 42]}}
                style={{
                  data: { stroke: "#969696" },
                }}
                data={ this.props.navigation.state.params.BBTData[rangeSelected] }
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
        height: '35%',
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

const lorem = "Charting your basal body temperature (BBT) and cervical mucus is a way to estimate when you'll ovulate so you'll know when to have sex if you want to conceive.  \n1. On the first day you get your period, fill in the date and day of the week under cycle day 1. Continue noting the dates of your cycle until the first day of your next period.  \n2. Each morning when you wake up – before you drink, eat, have sex, or even sit up in bed – take your temperature with a basal thermometer, and put a dot next to the temperature that matches your thermometer reading for that day. (You can also note the time you took your temperature. Try to take it at about the same time each morning.) Connect the dots to see how your basal temperature fluctuates from day to day.  \n3. You can also check your cervical mucus each day if you wish. \n4. Toward the end of your cycle, watch for a day when your BBT rose 0.5 to 1 degree F and stayed high. That day is usually the day you ovulated. It should correspond with the last day you noticed egg-white type cervical mucus. The days when you notice egg-white type mucus are your most fertile.  \n5. Track these symptoms for a few months to see if you notice an uptick in BBT and egg-white type mucus at the same time each cycle. That will allow you to plan which days to have sex if you want to get pregnant.  \n6. For the best chance of conceiving, have sex at least every other day during your most fertile period.";
//NavigationActions.reset({ index: 0, actions: [{type: NavigationActions.NAVIGATE, routeName: 'Login'}], key: null })