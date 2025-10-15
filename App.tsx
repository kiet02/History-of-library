/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Main } from '@screen/Main';

export default function Screen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Main />
    </GestureHandlerRootView>
  );
}
