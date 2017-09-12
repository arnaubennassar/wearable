import React from 'react'
import { Platform } from 'react-native';

import IconAnimation  from './IconAnimation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet } from 'react-native';

export default class NavButtons extends React.Component {
	selectedColor: 'pink';
	unselectedColor: 'red';
	selectedSize: 37;
	unselectedSize: 20;
	render(){
		return(
			<View style={styles.container}>
				{this.props.selected == 0? <Icon size={ this.selectedSize } name={ 'home' } color={ this.selectedColor }/> : <Icon size={ this.unselectedSize } name={ 'home' } color={ this.unselectedColor }/>}
				{this.props.selected == 1? <Icon size={ this.selectedSize } name={ 'home' } color={ this.selectedColor }/> : <Icon size={ this.unselectedSize } name={ 'home' } color={ this.unselectedColor }/>}
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