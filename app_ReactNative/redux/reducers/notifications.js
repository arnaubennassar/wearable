/*@flow*/

let cloneObject = function (obj){
  return JSON.parse(JSON.stringify(obj));
}

export const notificationsDefault: notificationsState =
{
  notifications:[]
};

type notificationsState = {
  notifications:Array
}

export const notificationsReducer = (state: notificationsState, action: Object) => {
  switch (action.type){
    case 'NOTIFICATIONS_UPDATED':
      var newState: notificationsState = cloneObject(state);
      newState.notifications = action.payload;
      return newState;
    default:
      return state || notificationsDefault;
  }
}
