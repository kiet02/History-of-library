/* eslint-disable react-native/no-inline-styles */
import { AppSharedTransitionStart } from '@element/AppSharedTransition/AppSharedTransitionStart';
import React from 'react';
import { View, Text } from 'react-native';

export function ListScreen() {
  return (
    <AppSharedTransitionStart
      targetScreen="Test"
      borderRadius={20}
      params={{ title: 'Open card' }}
      style={{ width: 300, height: 200 }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: 20,
          backgroundColor: '#4C6FFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
          Open card
        </Text>
      </View>
    </AppSharedTransitionStart>
  );
}
