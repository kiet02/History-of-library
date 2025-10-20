// App.tsx
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ListScreen } from '@screen/ListScreen';
import { DetailScreen } from '@screen/DetailScreen';
import { Main } from '@screen/Main';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function App() {
  const methods = useForm({
    defaultValues: {
      pageX: 0,
      pageY: 0,
      width: 0,
      height: 0,
      borderRadius: 0,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FormProvider {...methods}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="ListScreen" component={ListScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
            <Stack.Screen name="Main" component={Main} />
          </Stack.Navigator>
        </NavigationContainer>
      </FormProvider>
    </SafeAreaView>
  );
}
