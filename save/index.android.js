/*@flow*/
import React from 'react'
import { AppRegistry, BackHandler } from 'react-native';
import APP from './app';
import { Provider } from 'react-redux'
import {store} from './redux/store'
//

class IVF extends React.Component {
//ANDROID BACK BUTTON
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function() {
        store.dispatch({ type: 'Navigation/BACK' });
        return true;
    });
  };
//
	render(){
		return(
		  <Provider store={store}>
		  	<APP />
		  </ Provider>
		)
	}
}

AppRegistry.registerComponent('save', () => IVF);
