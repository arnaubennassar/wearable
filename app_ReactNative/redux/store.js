/*@flow*/
//redux
import {REHYDRATE} from 'redux-persist/constants'
import createActionBuffer from 'redux-action-buffer'
import { AsyncStorage } from 'react-native';
import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import logger from 'redux-logger';
//reducers
import {userReducer, userDefault} from './reducers/user';
import {dataReducer, dataDefault} from './reducers/data';
import {pendingReducer, pendingDefault} from './reducers/pending';
import {BTReducer, BTDefault} from './reducers/BT';
import {notificationsReducer, notificationsDefault} from './reducers/notifications';
//custom nav reducer
import {tabReducer, tabDefault} from './reducers/tab';

//Non custom Nav Reducers
	import {HomeNav} from '../navigation/tabs/HomeStack';
	import {NotificationNav} from '../navigation/tabs/NotificationStack';
	import {ProfileNav} from '../navigation/tabs/ProfileStack';

const reducers = combineReducers({
  user: userReducer,
  data: dataReducer,
  pending: pendingReducer,
  BT: BTReducer,
  notifications: notificationsReducer,
  //navigation reducers
  tab: tabReducer,
    home: (state,action) => HomeNav.router.getStateForAction(action,state),
    notification: (state,action) => NotificationNav.router.getStateForAction(action,state),
    profile: (state,action) => ProfileNav.router.getStateForAction(action,state),
});

var initialState = {
	user: userDefault,
	data: dataDefault,
	pending: pendingDefault,
	BT: BTDefault,
	notifications: notificationsDefault
}
//persistent redux
export const store = createStore(
	reducers, 
	initialState, 
	compose(
		autoRehydrate(),
		applyMiddleware( createActionBuffer(REHYDRATE), thunk,  logger  )
	)
);
persistStore( store, { storage: AsyncStorage, blacklist: ['tab', 'home', 'notification', 'profile', 'BT'] } );