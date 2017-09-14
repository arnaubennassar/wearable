export function pendingActions (actions){
  return {type: "PENDING", payload:{pendingActions: actions}};
}

export function cleanPendings (){
  return {type: "CLEAN_PENDINGS"};
}