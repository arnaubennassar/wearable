import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';


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
            <VictoryChart
              theme={VictoryTheme.material}
              height={160}
              animate={{duration: 500, onLoad: {duration: 1000}}}
              easing="linear"
            >
              <VictoryLine
                interpolation="natural"
                data={ [
                  {x: 1, y: Math.random() * 10, key: 0},
                  {x: 2, y: Math.random() * 10, key: 1},
                  {x: 3, y: Math.random() * 10, key: 2},
                  {x: 4, y: Math.random() * 10, key: 3},
                  {x: 5, y: Math.random() * 10, key: 4}
                ]}
              />
            </VictoryChart>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

//NavigationActions.reset({ index: 0, actions: [{type: NavigationActions.NAVIGATE, routeName: 'Login'}], key: null })