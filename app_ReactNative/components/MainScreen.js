/*@flow*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, StatusBar } from 'react-native';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as userActions    from '../redux/actions/user';

import NavButtons from './NavButtons';

//REDUX CONNECTION
function mapStateToProps(state){return{
  state: {
    user: state.user.user,
  }
};};

function mapDispatchToProps(dispatch){return {
    actions: {
      user: bindActionCreators(userActions, dispatch),   
    }    
}};
//

class MainScreen extends Component {
    render() {
        return (
            <Image style={styles.container} source={require('../resources/images/splash.png')} >
                <StatusBar backgroundColor="#F53B91" barStyle="light-content" />
                <Text> Main </Text>
                <Button onPress={ () => this.props.navigation.navigateWithDebounce("DetailScreen") } title="Go to Detail" />
                <Button onPress={ () => this.props.actions.user.logout() } title="LOGOUT" />
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
      justifyContent: 'center',
      alignItems: 'center',
    }
});

//REDUX CONNECTION
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);