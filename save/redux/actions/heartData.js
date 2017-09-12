/*@flow*/

export function currentHeartBeat(heartBeat: number){
  return {type: "HEART_BEAT", payload: heartBeat}
}

export function heartDataLoaded (){
  return {type: "HEART_LOADED"}
}

export function iniAppData(){
  return {type: "RELOAD_DATA"}
}
