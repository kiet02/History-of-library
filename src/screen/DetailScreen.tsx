import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppSharedTransition } from '@element/AppSharedTransition';
const TEST_IMG = require('@utils/resource/image/test.jpg');
export function DetailScreen() {
  const navigation = useNavigation();
  return (
    <>
      <AppSharedTransition tag="end" easing="inOut" duration={500}>
        <Image
          source={TEST_IMG}
          style={{ width: '100%', height: '70%', padding: 10 }}
          resizeMode="cover"
        />
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
    backgroundColor: 'black',
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
