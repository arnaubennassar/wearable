/*@flow*/
import {REHYDRATE} from 'redux-persist/constants'
import {postOSID, getHeartData } from '../../buissLogic/api';

let cloneObject = function (obj){
  return JSON.parse(JSON.stringify(obj));
}

export const userDefault: UserState = { 
  user: {
    appInitialized: false,
    rehydrated: false,
    registering: false,
    registerLoading: false,
    registerError: '',
    registered: false,
    validating: false,
    validateLoading: false,
    validateError: '',
    validated: false,
    loadingLogin:false,
    loggedIn: false,
    loginError: '',
    validCredentials:false,
    registeredOS:false,
    hasPendings:false,
    email: '',
    password: '',
    tokenAWS: '',
    tokenOS: '',
    skipPersonalData:false,
    height:0,
    weight:0,
    bday:'',
    pendingActions: []
  } 
};

type UserState = {
  user:{
    appInitialized: boolean,
    rehydrated: boolean,
    registering: boolean,
    registerLoading: boolean,
    registerError: Object,
    registered: boolean,
    validating: boolean,
    validateLoading: boolean,
    validateError: Object,
    validated: boolean,
    loadingLogin: boolean,
    loggedIn: boolean,
    loginError: string,
    validCredentials: boolean,
    registeredOS: boolean,
    hasPendings: boolean,
    email: string,
    password: string,
    tokenAWS: string,
    tokenOS: string,
    skipPersonalData: boolean,
    height: number,
    weight: number,
    bday: string,
    pendingActions: array[],
    firstBBT: 0,
    lastBBT: 0,
    firstSleep: 0,
    lastSleep: 0,
    firstActivity: 0,
    lastActivity: 0
  }
}

export const userReducer = (state: UserState, action: Object) => {
  switch (action.type){
    case REHYDRATE:
      var newState: UserState = action.payload.user;
      if (newState == undefined){
        return state;
      }
      newState.user.appInitialized = false;
      newState.user.loginError = '';
      newState.user.registerError = '';
      newState.user.validateError = '';
      return newState;
    case "APP_INITIALIZED":
      var newState: UserState = cloneObject(state);
      newState.user.appInitialized = true;
      newState.user.loadingLogin = false;
      return newState;
    case "REGISTER_MODE":
      var newState: UserState = cloneObject(state);
      newState.user.registering = true;
      return newState;
    case "REGISTER_START":
      var newState: UserState = cloneObject(state);
      newState.user.registerLoading = true;
      newState.user.registerError = '';
      newState.user.email = action.payload.email;
      newState.user.password = action.payload.password;
      return newState;
    case "REGISTER_SUCCESS":
      var newState: UserState = cloneObject(state);
      newState.user.registerLoading = false;
      newState.user.registered = true;
      newState.user.registering = false;
      newState.user.validating = true;
      return newState;
    case "REGISTER_FAIL":
      var newState: UserState = cloneObject(state);
      newState.user.registerLoading = false;
      newState.user.registerError = action.payload.error;
      return newState;
    case "REGISTER_CANCEL":
      var newState: UserState = cloneObject(state);
      newState.user.registering = false;
      return newState;
    case "VALIDATION_MODE":
      var newState: UserState = cloneObject(state);
      newState.user.validating = true;
      return newState;
    case "VALIDATION_START":
      var newState: UserState = cloneObject(state);
      newState.user.validateLoading = true;
      newState.user.validateError = '';
      return newState;
    case "VALIDATION_SUCCESS":
      var newState: UserState = cloneObject(state);
      newState.user.validateLoading = false;
      newState.user.validated = true;
      newState.user.loggedIn = true;
      newState.user.validCredentials = true;
      newState.user.validating = false;
      return newState;
    case "VALIDATION_FAIL":
      var newState: UserState = cloneObject(state);
      newState.user.validateLoading = false;
      newState.user.validateError = action.payload.error;
      return newState;
    case "VALIDATION_CANCEL":
      var newState: UserState = cloneObject(state);
      newState.user.validating = false;
      return newState;
    case "LOGIN_START":
      var newState: UserState = cloneObject(state);
      newState.user.loggedIn = false;
      newState.user.loadingLogin = true;
      newState.user.loginError = '';
      newState.user.email = action.payload.email;
      newState.user.password = action.payload.password;
      return newState;
    case "LOGIN_SUCCESS":
      var newState: UserState = cloneObject(state);
      newState.user.loggedIn = true;
      newState.user.loadingLogin = false;
      newState.user.validCredentials = true;
      newState.user.tokenAWS = action.payload.tokenAWS;
      if (newState.user.tokenOS != undefined){
        postOSID(newState.user.tokenAWS, newState.user.tokenOS);
      }
      return newState;
    case "LOGIN_FAIL":
      var newState: UserState = cloneObject(state);
      newState.user.loadingLogin = false;
      newState.user.loginError = action.payload.error;
      newState.user.validCredentials = false;
      return newState;
    case "REFRESH_TOKEN":
      var newState: UserState = cloneObject(state);
      newState.user.validCredentials = false;
      return newState;
    case "SILENT_LOGIN":
      var newState: UserState = cloneObject(state);
      newState.user.loadingLogin = true;
      return newState;
    case "LOGOUT":
      var newState = userDefault;
      newState.user.appInitialized = true;
      newState.user.tokenOS = state.user.tokenOS;
      return newState;
    case "OS_SUCCESS":
      if (action.payload.tokenOS != state.user.tokenOS){
        var newState: UserState = cloneObject(state);
        newState.user.registeredOS = true;
        newState.user.tokenOS = action.payload.tokenOS;

              //  INPROVE THIS BS


        if (newState.user.loggedIn){
          postOSID(newState.user.tokenAWS, newState.user.tokenOS);
        }
        return newState;
      }
      return state;
    case "SET_PERSONAL_DATA":
      var newState: UserState = cloneObject(state);
      newState.user.height = action.payload.height;
      newState.user.weight = action.payload.weight;
      newState.user.bday = action.payload.bday;
      newState.user.skipPersonalData = true;
      return newState;
    case "SKIP_PERSONAL_DATA":
      var newState: UserState = cloneObject(state);
      newState.user.skipPersonalData = true;
      return newState;
    case "FIRST_BBT":
      var newState: UserState = cloneObject(state);
      newState.user.firstBBT = action.payload;
      return newState;
    case "LAST_BBT":
      var newState: UserState = cloneObject(state);
      newState.user.lastBBT = action.payload;
      return newState;
    case "FIRST_ACTIVITY":
      var newState: UserState = cloneObject(state);
      newState.user.firstActivity = action.payload;
      return newState;
    case "LAST_ACTIVITY":
      var newState: UserState = cloneObject(state);
      newState.user.lastActivity = action.payload;
      return newState;
    case "FIRST_SLEEP":
      var newState: UserState = cloneObject(state);
      newState.user.firstSleep = action.payload;
      return newState;
    case "LAST_SLEEP":
      var newState: UserState = cloneObject(state);
      newState.user.lastSleep = action.payload;
      return newState;
    default:
      return state || userDefault;
  }
}
