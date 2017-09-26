/*@flow*/
//react
import React from 'react'
import { Platform } from 'react-native';
import { connect } from 'react-redux'
//navigation
import { addNavigationHelpers, StackNavigator } from 'react-navigation'
import DashboardScreen    from '../../components/DashboardScreen';
import BBTScreen  from '../../components/BBTScreen';
//import IconAnimation  from '../../components/IconAnimation';
//import { BlueTooth } from '../../components/BlueTooth';
// Icon
import Icon from 'react-native-vector-icons/MaterialIcons';
//Stack Navigation Configuration
const routeConfiguration = {
  DashboardScreen: { 
    screen: DashboardScreen,
    //screen: BlueTooth,
    navigationOptions:{header: null}
  },
  BBTScreen: { 
    screen: BBTScreen,
    navigationOptions:{
      title: 'Detail',
      headerStyle: { backgroundColor: "#F53B91" }, //Header color
      headerTintColor: "white", //Back arrow color
      headerPressColorAndroid: "pink", //Ripple effect
      headerBackTitle: "Back" //Text following the back arrow (iOS)
    }
  },
}

const stackNavigatorConfiguration = {
  initialRouteName: 'DashboardScreen',
//  mode: 'modal',    //Slide from bottom (iOS)
}
export const HomeNav = StackNavigator(routeConfiguration, stackNavigatorConfiguration);

const mapStateToProps = (state) => {
 return {
    navigationState: state.home
  }
}

class HomeClass extends React.Component {

  static swipeEnabled = false;
  static navigationOptions = ({navigation, screenProps}) => ({
        tabBarLabel: 'Dashboard',
        tabBarVisible: !navigation.state.params.hideTabBar,
        //tabBarIcon: ({ tintColor, focused }) => focused? <Icon size={ 50 } name={ 'dashboard' } color={ '#F9308A' }/> : <Icon size={ 40 } name={ 'dashboard' } color={ '#FB92C3' }/>,
        tabBarIcon: ({ tintColor, focused }) => (Platform.OS === 'ios') ?
            <Icon size={ 28 } name={ 'dashboard' } color={ tintColor }/>  :
            focused? <Icon size={ 50 } name={ 'dashboard' } color={ '#F9308A' }/> : <Icon size={ 40 } name={ 'dashboard' } color={ '#FB92C3' }/> 
  })

  render(){
    const { navigationState, dispatch } = this.props

    return (
      <HomeNav
        navigation={
          _addNavigationHelpers({
            dispatch: dispatch,
            state: navigationState
          })
        }
      />
    )
  }
}

export default connect(mapStateToProps)(HomeClass);
