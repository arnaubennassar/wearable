/*@flow*/
//react
import React from "react";
import { Platform } from "react-native";
import { connect } from "react-redux";
//navigation
import { addNavigationHelpers, StackNavigator } from "react-navigation";
import ProfileScreen from "../../components/ProfileScreen";
import PersonalDataScreen from "../../components/PersonalDataScreen";
import * as BT from "../../components/BlueTooth";
// Icon
import Icon from "react-native-vector-icons/FontAwesome";
//Stack Navigation Configuration
const routeConfiguration = {
  ProfileScreen: {
    screen: ProfileScreen,
    navigationOptions: { header: null }
  },
  PersonalDataScreen: {
    screen: PersonalDataScreen,
    navigationOptions: {
      title: "Personal Data",
      headerStyle: { backgroundColor: "#F53B91" }, //Header color
      headerTintColor: "white", //Back arrow color
      headerPressColorAndroid: "#54B674", //Ripple effect
      headerBackTitle: "Back" //Text following the back arrow (iOS)
    }
  },
  BTScreen: {
    screen: BT.BTScreen,
    navigationOptions: {
      title: "BlueTooth",
      headerStyle: { backgroundColor: "#F53B91" }, //Header color
      headerTintColor: "white", //Back arrow color
      headerPressColorAndroid: "#54B674", //Ripple effect
      headerBackTitle: "Back" //Text following the back arrow (iOS)
    }
  }
};
const stackNavigatorConfiguration = {
  initialRouteName: "ProfileScreen"
};
export const ProfileNav = StackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration
);

const mapStateToProps = state => {
  return {
    navigationState: state.profile
  };
};

class ProfileClass extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarLabel: "Profile",
    tabBarVisible: !navigation.state.params.hideTabBar,
    tabBarIcon: ({ tintColor, focused }) =>
      Platform.OS === "ios" ? (
        <Icon size={28} name={"user"} color={tintColor} />
      ) : focused ? (
        <Icon size={50} name={"user"} color={"#F9308A"} />
      ) : (
        <Icon size={40} name={"user"} color={"#FB92C3"} />
      )
  });

  render() {
    const { navigationState, dispatch } = this.props;

    return (
      <ProfileNav
        navigation={_addNavigationHelpers({
          dispatch: dispatch,
          state: navigationState
        })}
      />
    );
  }
}

export default connect(mapStateToProps)(ProfileClass);
