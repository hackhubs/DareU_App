/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react'
import MainState from './src/MainContext/MainState';
import {Provider} from 'react-redux'
import configureStore from './src/store';

const store = configureStore()
const RootApp = () => <Provider store={store}>
    <MainState>
    <App/>
</MainState>
</Provider>
AppRegistry.registerComponent(appName, () => RootApp);
