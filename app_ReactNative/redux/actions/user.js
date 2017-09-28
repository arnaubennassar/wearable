/*@flow*/

import {clearData} from '../../buissLogic/storage';

export function appInitialized(){
	return {type: "APP_INITIALIZED"}; 
}

export function registerMode(){
  return {type: "REGISTER_MODE"};
}

export function registerStart(email: string, password: string){
  return {type: "REGISTER_START", payload:{email: email, password: password}};
}

export function registerSuccess(){
  return {type: "REGISTER_SUCCESS"};
}

export function registerFail(error: Object){
  return {type: "REGISTER_FAIL", payload: {error: error}};  
}

export function cancelRegister(){
  return {type: "REGISTER_CANCEL"};  
}

export function validateMode(){
  return {type: "VALIDATION_MODE"};
}

export function validationStart(){
  return {type: "VALIDATION_START"};
}

export function validationSuccess(){
  return {type: "VALIDATION_SUCCESS"};
}

export function validationFail(error: Object){
  return {type: "VALIDATION_FAIL", payload: {error: error}};  
}

export function cancelValidation(){
  return {type: "VALIDATION_CANCEL"};  
}

export function loginStart(email: string, password: string){
  return {type: "LOGIN_START", payload:{email: email, password: password}};
}

export function loginSuccess(id: string){
  return {type: "LOGIN_SUCCESS", payload:{tokenAWS:id}};
}

export function loginFail(error: string){
  return {type: "LOGIN_FAIL", payload: {error: error}};  
}

export function OSRegistered(id: string){
  return {type: "OS_SUCCESS", payload:{tokenOS:id}};
}

export function refreshToken(){
  return {type: "REFRESH_TOKEN"};  
}

export function silentLoginStart(){
  return {type: "SILENT_LOGIN"};  
}

export function logout(){
  clearData();
  return {type: "LOGOUT"}
}

export function setPersonalData (height: number, weight:number, bday:string){
  return {type: "SET_PERSONAL_DATA", payload:{height: height, weight:weight, bday: bday}};
}

export function skipPersonalData (){
  return {type: "SKIP_PERSONAL_DATA"};
}

export function pendingAction (action){
  return {type: "PENDING", payload:{pendingAction: action}};
}

export function cleanPendings (){
  return {type: "CLEAN_PENDINGS"};
}

export function setFirstMinBBT (timeStamp){
  return {type: "FIRST_BBT", payload:timeStamp};
}

export function setLastMinBBT (timeStamp){
  return {type: "LAST_BBT", payload:timeStamp};
}

export function setFirstDailyActivity (timeStamp){
  return {type: "FIRST_ACTIVITY", payload:timeStamp};
}

export function setLastDailyActivty (timeStamp){
  return {type: "LAST_ACTIVITY", payload:timeStamp};
}

export function setFirstSleep (timeStamp){
  return {type: "FIRST_SLEEP", payload:timeStamp};
}

export function setLastSleep (timeStamp){
  return {type: "LAST_SLEEP", payload:timeStamp};
}

