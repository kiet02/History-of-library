import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  Text,
  TouchableOpacity,
} from 'react-native';
import { AppSharedTransition } from '@element/AppSharedTransition';
import { useNavigation } from '@react-navigation/native';
import { TStack } from '@navigation/type';

const TEST_IMG = require('@utils/resource/image/test.jpg');

export function ListScreen() {
  const navi = useNavigation<TStack>();
  const handlePress = () => {
    navi.navigate('Detail');
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress}>
        <AppSharedTransition tag="start">
          <Image source={TEST_IMG} style={styles.image} resizeMode="cover" />
        </AppSharedTransition>
      </Pressable>

      <Text style={styles.hint}>Tap image to open detail</Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navi.navigate('Detail')}
      >
        <Text style={styles.actionText}>Tap to go next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 20,
  },
  hint: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
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
