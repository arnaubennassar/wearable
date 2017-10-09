/*@flow*/

export function dataUpdated(data){
	return {type: "DATA_UPDATED", payload: data};
}

export function checkFertility(token){
	return {type: "DATA_FERTILITY", payload: {token: token}};
}

