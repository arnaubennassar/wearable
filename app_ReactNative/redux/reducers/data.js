/*@flow*/

let cloneObject = function (obj){
  return JSON.parse(JSON.stringify(obj));
}

export const dataDefault: DataState =
{
  data: {
    BBT:[],
    sleep: [], 
    dailyActivity: [],
    activityObjective: 100000,
    lastUpdate: Date.parse(new Date())
  }, 
};

type DataState = {
  data:{
    BBT:[{
      v: number,
      c: number
    }],
    sleep:[{
      v: number,
      c: number
    }],
    dailyActivity:[{
      v: number,
      c: number
    }],
    activityObjective: number,
    lastUpdate: number
  }
}

function getSleepTime(data){
  var ans = 0;
  for (var i = 0; i < data.length; i++) {
    ans += (data[i].sleep) ? (data[i].c_out - data[i].c) : 0;
  };
  return ans;
}

function getAcumulatedActivity(data){
  var ans = 0;
  for (var i = 0; i < data.length; i++) {
    ans += data[i].v;
  };
  return ans;
}

export const dataReducer = (state: DataState, action: Object) => {
  switch (action.type){
    case 'DATA_UPDATED':
      var newState: DataState = cloneObject(state);
//dailyActivity
      if (action.payload.activity != null){

        if(newState.data.dailyActivity.length === 0){//first sample

          for(var i = 0; i < action.payload.activity.length; ++i){
            newState.data.dailyActivity[i] = {c: action.payload.activity[i][0].c, v: getAcumulatedActivity(action.payload.activity[i])}
          }
        }
        else {
          var i = 0;
          var newActivityData = [];
          if (new Date(newState.data.dailyActivity[newState.data.dailyActivity.length - 1].c).getDate() == new Date(action.payload.activity[0].c).getDate()){//sample from the same day
            newState.data.dailyActivity[newState.data.dailyActivity.length - 1].v += getAcumulatedActivity(action.payload.activity[0]);
            i = 1;
          }
          for(i; i < action.payload.activity.length; ++i){
            newActivityData[i] = {c: action.payload.activity[i][0].c, v: getAcumulatedActivity(action.payload.activity[i])}
          }
          newState.data.dailyActivity.push.apply(newState.data.dailyActivity, newActivityData);
        }
      }
//BBT
      if (action.payload.BBT != null){
        console.log(action.payload.BBT)
        if(newState.data.BBT.length === 0){//First sample
          for (var i = 0; i < action.payload.BBT.length; i++) {
            newState.data.BBT[i] = action.payload.BBT[i][0];
          };
        }
        else {
          if (new Date(newState.data.BBT[newState.data.BBT.length - 1].c).getDate() == new Date(action.payload.BBT[0][0].c).getDate()){
            if ( newState.data.BBT[newState.data.BBT.length - 1].v > action.payload.BBT[0][0].v ){//sample from the same day and lower temperature
              newState.data.BBT.pop;
            }
          }
          currentLength = newState.data.BBT.length;
          for (var i = 0; i < action.payload.BBT.length; i++) {
            newState.data.BBT[i + currentLength] = action.payload.BBT[i][0];
          };
        }
      }
//SLEEP
      if (action.payload.sleep != null){
        console.log(action.payload.sleep)
        if(newState.data.sleep.length === 0){//first sample
          for(var i = 0; i < action.payload.sleep.length; ++i){
            newState.data.sleep[0] = {c: action.payload.sleep[i][0].c, v: getSleepTime(action.payload.sleep[i])}
          }
        }
        else {
          var i = 0;
          var newSleepData = [];
          if (new Date(newState.data.sleep[newState.data.sleep.length - 1].c).getDate() == new Date(action.payload.sleep[0].c).getDate()){//sample from the same day
            newState.data.sleep[newState.data.sleep.length - 1].v += getSleepTime(action.payload.sleep[0]);
            i = 1;
          }
          for(i; i < action.payload.sleep.length; ++i){
            newSleepData[i] = {c: action.payload.sleep[i][0].c, v: getSleepTime(action.payload.sleep[i])}
          }
          newState.data.sleep.push.apply(newState.data.sleep, newSleepData);
        }
      }
      if (action.payload.lastUpdate < 0){
        newState.data.lastUpdate = action.payload.lastUpdate;
      }
      return newState;

    case "LOGOUT":
      return dataDefault;
    default:
      return state || dataDefault;

  }
}




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

