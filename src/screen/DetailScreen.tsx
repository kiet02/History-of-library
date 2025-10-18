/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppSharedTransition } from '@element/AppSharedTransition';

export function DetailScreen() {
  const navigation = useNavigation();

  return (
    <>
      <AppSharedTransition tag="end" overlayMaxOpacity={0.5} easing="outQuad">
        <View style={{ width: 300, height: 100, backgroundColor: 'red' }} />
      </AppSharedTransition>

      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Detail Screen</Text>
          <Text style={styles.subtitle}>Beautiful Image</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.actionText}>Tap to go back</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
    marginTop: 8,
    opacity: 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '300',
  },
  actionButton: {
    margin: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
