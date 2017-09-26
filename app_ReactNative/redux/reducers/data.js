/*@flow*/

let cloneObject = function (obj){
  return JSON.parse(JSON.stringify(obj));
}

export const dataDefault: DataState =
{
  data: {
    activity:[],
    dailyActivity: 0,
    activityObjective: 100000,
    heart:[],
    temperature:[]
  }, 
};

type DataState = {
  data:{
    activity:[{
      amount: number,
      timeStamp: string
    }],
    dailyActivity: number,
    activityObjective: number,
    heart:[{
      BPM: number,
      timeStamp: string
    }],
    temperature:[{
      temperauture: number,
      timeStamp: string
    }]
  }
}

export const dataReducer = (state: DataState, action: Object) => {
  switch (action.type){
    case 'DATA_UPDATED':
      var newState: DataState = cloneObject(state);
      if (action.payload.activity != null){
        if(newState.data.activity === undefined){
          newState.data.activity = action.payload.activity;
        }
        else newState.data.activity.push.apply(newState.data.activity, action.payload.activity);
      }
      if (action.payload.activityIncrement != null){
        newState.data.dailyActivity += action.payload.activityIncrement;
      }
      if (action.payload.heart != null){
        if(newState.data.heart === undefined){
          newState.data.heart = action.payload.heart;
        }
        else newState.data.heart.push.apply(newState.data.heart, action.payload.heart);
      }
      if (action.payload.temperature != null){
        if(newState.data.temperature === undefined){
          newState.data.temperature = action.payload.temperature;
        }
        else newState.data.temperature.push.apply(newState.data.temperature, action.payload.temperature);
      }
      return newState;
                        //BS...
    // case 'DATA_LOADING':
    //   var newState: DataState = cloneObject(state);
    //   newState.data.loadMore = false;
    //   newState.data.loadingData = true;
    //   return newState;
    // case 'MORE_DATA_LOADING':
    //   var newState: DataState = cloneObject(state);
    //   newState.data.loadMore = true;
    //   return newState;
    // case 'DATA_RECIEVED':
    //   var newState: DataState = cloneObject(state);
    //   newState.data.data = action.payload;
    //   newState.data.loadingData  = false;
    //   newState.data.fetchedData  = true;
    //   newState.data.refreshing = false;
    //   newState.data.dataOutdated = false;
    //   return newState;
    // case 'MORE_DATA_RECIEVED':
    //   var newState: DataState = cloneObject(state);
    //   newState.data.data.push.apply(newState.data.data, action.payload);
    //   newState.data.loadingData  = false;
    //   newState.data.fetchedData  = true;
    //   newState.data.refreshing = false;
    //   newState.data.loadMore = false;
    //   newState.data.dataOutdated = false;
    //   return newState;
    // case 'DATA_FAIL':
    //   var newState: DataState = cloneObject(state);
    //   newState.data.loadingData  = false;
    //   newState.data.dataFailed   = true;
    //   newState.data.refreshing = false;
    //   newState.data.loadMore = false;
    //   newState.data.dataOutdated = true;
    //   return newState;
    // case 'OFFLINE_DATA_RECIEVED':
    //   var newState: DataState = cloneObject(state);
    //   newState.data.data = action.payload;
    //   newState.data.fetchedData = true;
    //   newState.data.refreshing = false;
    //   newState.data.loadMore = false;
    //   newState.data.dataOutdated = true;
    //   return newState;
    // case 'DATA_REFRESH':
    //   var newState: DataState = cloneObject(state);
    //   newState.data.loadMore = false;
    //   newState.data.refreshing = true;
    //   return newState;
                      ///
    default:
      return state || dataDefault;
  }
}
