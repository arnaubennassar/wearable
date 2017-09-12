/*@flow*/
import React from 'react'
import { AppRegistry } from 'react-native';
import APP from './app';
import { Provider } from 'react-redux'
import {store} from './redux/store'

class IVF extends React.Component {

	render(){
		return(
		  <Provider store={store}>
		  	<APP />
		  </ Provider>
		)
	}
}

AppRegistry.registerComponent('save', () => IVF);
