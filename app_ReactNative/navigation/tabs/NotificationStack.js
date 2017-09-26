/*@flow*/
//react
import React from "react";
import { Platform } from "react-native";
import { connect } from "react-redux";
//navigation
import { addNavigationHelpers, StackNavigator } from "react-navigation";
import MainScreen from "../../components/MainScreen";
import DetailScreen from "../../components/DetailScreen";
// Icon
import Icon from "react-native-vector-icons/FontAwesome";
//Stack Navigation Configuration
const routeConfiguration = {
  MainScreen: {
    screen: MainScreen,
    navigationOptions: { header: null }
  },
  DetailScreen: {
    screen: DetailScreen,
    navigationOptions: {
      headerStyle: { backgroundColor: "#F53B91" }, //Header color
      headerTintColor: "white", //Back arrow color
      headerPressColorAndroid: "pink", //Ripple effect
      headerBackTitle: "Back" //Text following the back arrow (iOS)
    }
  }
};
const stackNavigatorConfiguration = {
  initialRouteName: "MainScreen"
};
export const NotificationNav = StackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration
);

const mapStateToProps = state => {
  return {
    navigationState: state.notification
  };
};

class NotificationClass extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarLabel: "Notifications",
    tabBarVisible: !navigation.state.params.hideTabBar,
    tabBarIcon: ({ tintColor, focused }) =>
      Platform.OS === "ios" ? (
        <Icon size={28} name={"inbox"} color={tintColor} />
      ) : focused ? (
        <Icon size={50} name={"inbox"} color={"#F9308A"} />
      ) : (
        <Icon size={40} name={"inbox"} color={"#FB92C3"} />
      )
  });

  render() {
    const { navigationState, dispatch } = this.props;

    return (
      <NotificationNav
        navigation={_addNavigationHelpers({
          dispatch: dispatch,
          state: navigationState
        })}
      />
    );
  }
}

export default connect(mapStateToProps)(NotificationClass);
