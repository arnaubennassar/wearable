/*@flow*/
let cloneObject = function (obj){
  return JSON.parse(JSON.stringify(obj));
}

export const pendingDefault: PendingState = { 
  pending: {
    hasPendings:false,
    pendingActions: []
  } 
};

type PendingState = {
  pending:{
    hasPendings: boolean,
    pendingActions: array[]
  }
}

export const pendingReducer = (state: PendingState, action: Object) => {
  switch (action.type){
    case "PENDING":
      var newState: PendingState = cloneObject(state);
      newState.pending.hasPendings = true;
      for (var i = 0; i < action.payload.pendingActions.length; i++) {
      	newState.pending.pendingActions.push( action.payload.pendingActions[i] );
      }; 
      return newState;
    case "CLEAN_PENDINGS":
      var newState: PendingState = cloneObject(state);
      newState.pending.pendingActions = [];
      newState.pending.hasPendings = false;
      return newState;
    default:
      return state || pendingDefault;
  }
}