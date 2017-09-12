export function connected (timeStamp){
  return {type: "BT_CONNECTED", payload: timeStamp}
}

export function desconnected (timeStamp){
  return {type: "BT_DESCONNECTED"}
}
