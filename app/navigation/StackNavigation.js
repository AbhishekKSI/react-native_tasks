// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateContactScreen from '../screens/CreateContactScreen';
import EditContactScreen from '../screens/EditContactScreen';
import ROUTES from './routes';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
        <Stack.Screen
          name={ROUTES.CREATE_CONTACT}
          component={CreateContactScreen}
        />
        <Stack.Screen
          name={ROUTES.EDIT_CONTACT}
          component={EditContactScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
