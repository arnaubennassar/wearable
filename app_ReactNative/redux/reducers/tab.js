/*@flow*/
import {TabNavConfiguration} from '../../navigation/TabNav';

let cloneObject = function (obj){
  return JSON.parse(JSON.stringify(obj));
}

export const tabDefault = {
  index: 0,
  routes: [
    { key: 'NotificationStack',  routeName: 'NotificationStack', params: {hideTabBar: false} },
    { key: 'HomeStack',  routeName: 'HomeStack', params: {hideTabBar: false} },
    { key: 'ProfileStack',  routeName: 'ProfileStack', params: {hideTabBar: false} },
  ],
  params: {hideTabBar: false}
};

export const tabReducer = (state, action: Object) => {
  switch (action.type){
    case 'Navigation/BACK':
       var newState = TabNavConfiguration.router.getStateForAction(action, state);
        newState.params.hideTabBar = false;
        newState.routes[0].params.hideTabBar = false;
        newState.routes[1].params.hideTabBar = false;
        newState.routes[2].params.hideTabBar = false;
        newState.index = state.index;
        return newState;
    case 'Navigation/NAVIGATE':
        var newState = TabNavConfiguration.router.getStateForAction(action, state);
       // var newState = cloneObject(state);
       // if (action.routeName == "NotificationStack"){
       //  newState.index =
       // }
        return newState;
    case 'Navigation/SET_PARAMS':
       var newState = TabNavConfiguration.router.getStateForAction(action, state);
        if(action.params) {
            newState.params = action.params;
            newState.routes[0].params.hideTabBar = true;
            newState.routes[1].params.hideTabBar = true;
            newState.routes[2].params.hideTabBar = true;
        }
       return newState;
    default:
      return state || tabDefault;
  }
}
