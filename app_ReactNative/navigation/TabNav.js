/*@flow*/
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Platform, Dimensions } from 'react-native';

import { TabNavigator, addNavigationHelpers, NavigationActions, TabView, TabBarTop } from 'react-navigation'
// TabNavigator Screens
import HomeStack from './tabs/HomeStack';
import NotificationStack from './tabs/NotificationStack';
import ProfileStack from './tabs/ProfileStack';

//Tab Navigation Configuration
var routeConfiguration = {
  NotificationStack: { screen: NotificationStack },
  HomeStack: { screen: HomeStack },
  ProfileStack: { screen: ProfileStack },
}
var tabStyle;
const hait = Dimensions.get('window').height;

if(Platform.OS === 'ios') {
  tabStyle = {
    // tint color is passed to text and icons (if enabled) on the tab bar
    activeTintColor: '#F9308A',
    inactiveTintColor: '#FB92C3',
    activeBackgroundColor: '#FDF3FB',
    inactiveBackgroundColor: '#FDF3FB',
    // style:{
    //   backgroundColor: 'rgba(0, 0, 0, 0)',
    //   borderTopWidth: 0,
    //   position: 'absolute',
    //   left: 0,
    //   right: 0,
    //   bottom: 0
    // }
  }
}
else {
  tabStyle = {
    // tint color is passed to text and icons (if enabled) on the tab bar
    activeTintColor: '#54B674',
    inactiveTintColor: '#54B674',
    indicatorStyle: {
      // borderBottomColor: '#54B674',
      // borderBottomWidth: 4,
      opacity: 0
    },
    style: {
      backgroundColor: '#FCF1FA',
    },
    iconStyle: {
        flex: 1,
        justifyContent: 'center',
        height: hait*0.1542,
        width: hait*0.1542,
        alignItems: 'center',
    },
    showIcon: true,
    showLabel: false
  }
}

var tabBarConfiguration = {
  initialRouteName: 'HomeStack',
  //...other configs
  tabBarOptions: tabStyle,
  swipeEnabled: true
}

export var TabNavConfiguration = TabNavigator(routeConfiguration,tabBarConfiguration);



const mapStateToProps = (state) => {
 return {
    navigationState: state.tab,
  }
}

//custom helper to prevent multitap
_addNavigationHelpers = (navigation) => {
  const original = addNavigationHelpers(navigation);
  let debounce;
  return {
    ...original,
    navigateWithDebounce: (routeName, params, action) => {
      let func = () => {
          if (debounce) {
              return;
          }
          navigation.dispatch(NavigationActions.navigate({
              routeName,
              params,
              action
          }));
          debounce = setTimeout(() => {
              debounce = 0;
          }, 1000)
      };
      return func();
    }
  }
};



class TabNavClass extends Component {

  render(){
    const { dispatch, navigationState } = this.props
    return (
      <TabNavConfiguration
        navigation={
          _addNavigationHelpers({
            dispatch: dispatch,
            state: navigationState,
          })
        }
      />
    )
  }
}

export default connect(mapStateToProps)(TabNavClass)
