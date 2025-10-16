import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from '@screen/ListScreen';
import SharedTransitionScreen from '@screen/SharedTransitionScreen';
import { RootStackParamList } from '@navigation/type';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="List"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen
          name="SharedTransitionScreen"
          component={SharedTransitionScreen}
          options={{
            presentation: 'transparentModal',
            animation: 'none',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
