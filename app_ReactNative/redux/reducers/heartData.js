/*@flow*/

let cloneObject = function (obj){
  return JSON.parse(JSON.stringify(obj));
}

export const heartDataDefault: DataState =
{
  heartData: {heart: 0, temperature: 0, activity:0, loadingHeartData: false, fetchedHeartData: false}
};

type DataState = {
  data:{
    heart: number,
    temperature: number,
    activity: number,
    loadingHeartData: boolean,
    fetchedHeartData: boolean
  }
}

export const heartDataReducer = (state: DataState, action: Object) => {
  switch (action.type){
    case 'HEART_BEAT':
      var newState: DataState = cloneObject(state);
      newState.data.heart = action.payload;
      newState.data.loadingHeartData = true;
      return newState;
    case 'HEART_LOADED':
      var newState: DataState = cloneObject(state);
      newState.data.loadingHeartData = false;
      newState.data.fetchedHeartData = true;
      return newState;
    case 'RELOAD_DATA':
      var newState: DataState = cloneObject(state);
      newState.data.loadingHeartData = false;
      newState.data.fetchedHeartData = false;
      return newState;
    default:
      return state || heartDataDefault;
  }
}
