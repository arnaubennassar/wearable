import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

var rangeSelector = [
  {label: '1 day',  value: 0 },
  {label: '1 week', value: 1 },
  {label: '1 month', value: 2 },
];
var rangeSelected = 0;
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
        return (
           <View style={styles.container}>
             <View style={styles.chartContainer}>
              <VictoryChart
                theme={VictoryTheme.material}
                height={220}
                animate={{duration: 500, onLoad: {duration: 1000}}}
                padding={{ top: 10, bottom: 30, left: 10, right: 10 }}
                easing="linear"
              >
                <VictoryAxis 
                  tickFormat={(t) => rangeSelected == 0 ?  `${Math.round(t)}h` : rangeSelected == 1 ? `${Math.round(t)}d` : `${Math.round(t)}e`} 
                  fixLabelOverlap={true} 
                  style={{ axis: {stroke: "#969696"}, grid: {stroke: (t) => (t > 2.5 && t < 25) ? "#F53B91" : "transparent"}, ticks: {stroke: "grey", size: 0} }} />
                <VictoryLine
                  style={{
                    data: { stroke: "#969696" },
                  }}
                  interpolation="natural"
                  data={ [
                    {x: 1, y: Math.random() * 15},
                    {x: 2, y: Math.random() * 15},
                    {x: 3, y: Math.random() * 15},
                    {x: 4, y: Math.random() * 15},
                    {x: 5, y: Math.random() * 15},
                    {x: 11, y: Math.random() * 15},
                    {x: 12, y: Math.random() * 15},
                    {x: 13, y: Math.random() * 15},
                    {x: 14, y: Math.random() * 15},
                    {x: 150, y: Math.random() * 15}
                  ]}
                />
              </VictoryChart>
            </View>

              
            <View style={{alignSelf:'center', width:'40%'}}>
              <RadioForm
                radio_props={rangeSelector}
                initial={0}
                onPress={(value) => { rangeSelected = value; this.forceUpdate();} }
                formHorizontal={true}
                labelHorizontal={false}
                buttonColor={"#F53B91"}
                labelColor={'#B5B2B2'}
                animation={true}
                buttonSize={5}
                buttonOuterSize={20}
              />
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      width:'100%',
      height:'100%'
    },
    chartContainer: {
        marginTop: 0,
        width:'100%',
        height: 220
    }
});

//NavigationActions.reset({ index: 0, actions: [{type: NavigationActions.NAVIGATE, routeName: 'Login'}], key: null })