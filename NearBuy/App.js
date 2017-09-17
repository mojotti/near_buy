'use strict';

import React from 'react';
import { StackNavigator } from 'react-navigation';
import LoginScreen from './Login';
import HomeScreen from './HomeScreen';


const AppScreens = StackNavigator({
  Login: { screen: LoginScreen },
  Home: { screen: HomeScreen },
});
export default AppScreens;
