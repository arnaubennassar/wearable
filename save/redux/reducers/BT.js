/*@flow*/

let cloneObject = function (obj){
  return JSON.parse(JSON.stringify(obj));
}

export const dataDefault: DataState =
{
  BT: { 
    connected: false,
    timeStamp: 0
  }
};

type BTState = {
  BT:{
    connected: boolean,
    timeStamp: number,
  }
}

export const BTReducer = (state: DataState, action: Object) => {
  switch (action.type){
    case 'BT_CONNECTED':
      var newState: BTState = cloneObject(state);
      newState.BT.connected = true;
      newState.BT.timeStamp = action.payload;
      return newState;
    case 'BT_DESCONNECTED':
      var newState: BTState = cloneObject(state);
      newState.BT.connected = false;
      return newState;
    default:
      return state || dataDefault;
  }
}
