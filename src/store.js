import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';


import UserReducer from './reducers/UserReducer';
import ChallengeReducer from './reducers/ChallengeReducer';
import ReportReducer from './reducers/ReportReducer';

const loggerMiddleware = createLogger();

const rootReducer = combineReducers({
    userState:UserReducer,
    challengeState:ChallengeReducer,
    reportState:ReportReducer,
})


export default function configureStore(preloadedState) {
    return createStore(
      rootReducer,
      preloadedState,
      applyMiddleware(thunkMiddleware, loggerMiddleware),
    );
  }