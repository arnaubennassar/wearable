import React, { Component } from 'react';
import { View } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';

export default class chartContinousLine extends Component {
  render() {
    return (
      <View>
        <VictoryChart
          theme={VictoryTheme.material}
          height={160}
          animate={{duration: 500, onLoad: {duration: 1000}}}
          easing="linear"
        >
          <VictoryLine
            interpolation="natural"
            data={{data: [
              {x: 1, y: Math.random() * 10, key: 0},
              {x: 2, y: Math.random() * 10, key: 1},
              {x: 3, y: Math.random() * 10, key: 2},
              {x: 4, y: Math.random() * 10, key: 3},
              {x: 5, y: Math.random() * 10, key: 4}
            ]}}
          />
        </VictoryChart>
      </View>
    );
  }
}