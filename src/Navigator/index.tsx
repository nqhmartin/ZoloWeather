import React from 'react';
type Props = {};
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import FailureScreen from '../Screens/FailureScreen';
const Stack = createStackNavigator();
const Navigator = (props: Props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Failure" component={FailureScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
