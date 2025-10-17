import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/type';
import { Test } from '@screen/Test';
import { FormProvider, useForm } from 'react-hook-form';
import { ListScreen } from '@screen/ListScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const methods = useForm({
    defaultValues: {
      pageX: 0,
      pageY: 0,
      width: 0,
      height: 0,
      borderRadius: 20,
    },
  });
  return (
    <FormProvider {...methods}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="List"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="List" component={ListScreen} />
          <Stack.Screen name="Test" component={Test} />
        </Stack.Navigator>
      </NavigationContainer>
    </FormProvider>
  );
}
