/*@flow*/



export function dataUpdated(data){
	return {type: "DATA_UPDATED", payload: data};
}

//BS...
export function initLoadingData (){
  return {type: "DATA_LOADING"}
}

export function loadMore (){
  return {type: "MORE_DATA_LOADING"}
}

export function dataRecieved(data){
  return {type: "DATA_RECIEVED", payload: data}
}

export function moreDataRecieved(data){
  return {type: "MORE_DATA_RECIEVED", payload: data}
}

export function dataFailed(){
  return {type: "DATA_FAIL"}
}

export function offlineData(data){
  return {type: "OFFLINE_DATA_RECIEVED", payload: data}
}

export function refresh (){
  return {type: "DATA_REFRESH"}
}
