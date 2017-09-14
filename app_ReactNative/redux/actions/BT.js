export function connected (timeStamp){
  return {type: "BT_CONNECTED", payload: timeStamp}
}

export function connecting (){
  return {type: "BT_CONNECTING"}
}

export function desconnected (){
  return {type: "BT_DESCONNECTED"}
}

export function enabled (){
  return {type: "BT_ENABLED"}
}

export function disabled (){
  return {type: "BT_DISABLED"}
}

export function skip (){
  return {type: "BT_SKIP"}
}


