/*@flow*/

let cloneObject = function (obj){
  return JSON.parse(JSON.stringify(obj));
}

export const BTDefault: BTState =
{
  BT: { 
    skip: false,
    enabled: false,
    connected: false,
    connecting: false,
    timeStamp: 0
  }
};

type BTState = {
  BT:{
    skip: boolean,
    enabled: boolean,
    connected: boolean,
    connecting: boolean,
    timeStamp: number,
  }
}

export const BTReducer = (state: BTState, action: Object) => {
  switch (action.type){
    case 'BT_CONNECTED':
      var newState: BTState = cloneObject(state);
      newState.BT.connected = true;
      newState.BT.skip = true;
      newState.BT.connecting = false;
      newState.BT.timeStamp = action.payload;
      return newState;
    case 'BT_DESCONNECTED':
      var newState: BTState = cloneObject(state);
      newState.BT.connected = false;
      newState.BT.connecting = false;
      return newState;
    case 'BT_CONNECTING':
      var newState: BTState = cloneObject(state);
      newState.BT.connecting = true;
      return newState;
    case 'BT_ENABLED':
      var newState: BTState = cloneObject(state);
      newState.BT.enabled = true;
      return newState;
    case 'BT_DISABLED':
      var newState: BTState = cloneObject(state);
      newState.BT.enabled = false;
      return newState;
    case 'BT_SKIP':
      var newState: BTState = cloneObject(state);
      newState.BT.skip = true;
      return newState;
    default:
      return state || BTDefault;
  }
}
