/*@flow*/

let cloneObject = function (obj){
  return JSON.parse(JSON.stringify(obj));
}

export const dataDefault: DataState =
{
  data: {
    data: [], 
    loadingData: false, 
    fetchedData: false, 
    dataOutdated: false, 
    dataFailed: false,
    refreshing: false,
    loadMore: false
  }
};

type DataState = {
  data:{
    data: array[],
    loadingData: boolean,
    fetchedData: boolean,
    dataOutdated: boolean,
    dataFailed: boolean,
    refreshing: boolean,
    loadMore: boolean,
  }
}

export const dataReducer = (state: DataState, action: Object) => {
  switch (action.type){
    case 'DATA_LOADING':
      var newState: DataState = cloneObject(state);
      newState.data.loadMore = false;
      newState.data.loadingData = true;
      return newState;
    case 'MORE_DATA_LOADING':
      var newState: DataState = cloneObject(state);
      newState.data.loadMore = true;
      return newState;
    case 'DATA_RECIEVED':
      var newState: DataState = cloneObject(state);
      newState.data.data = action.payload;
      newState.data.loadingData  = false;
      newState.data.fetchedData  = true;
      newState.data.refreshing = false;
      newState.data.dataOutdated = false;
      return newState;
    case 'MORE_DATA_RECIEVED':
      var newState: DataState = cloneObject(state);
      newState.data.data.push.apply(newState.data.data, action.payload);
      newState.data.loadingData  = false;
      newState.data.fetchedData  = true;
      newState.data.refreshing = false;
      newState.data.loadMore = false;
      newState.data.dataOutdated = false;
      return newState;
    case 'DATA_FAIL':
      var newState: DataState = cloneObject(state);
      newState.data.loadingData  = false;
      newState.data.dataFailed   = true;
      newState.data.refreshing = false;
      newState.data.loadMore = false;
      newState.data.dataOutdated = true;
      return newState;
    case 'OFFLINE_DATA_RECIEVED':
      var newState: DataState = cloneObject(state);
      newState.data.data = action.payload;
      newState.data.fetchedData = true;
      newState.data.refreshing = false;
      newState.data.loadMore = false;
      newState.data.dataOutdated = true;
      return newState;
    case 'DATA_REFRESH':
      var newState: DataState = cloneObject(state);
      newState.data.loadMore = false;
      newState.data.refreshing = true;
      return newState;
    default:
      return state || dataDefault;
  }
}
