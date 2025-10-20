import React from 'react';
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedReaction,
  scrollTo,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { View, Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Main() {
  const leftRef = useAnimatedRef<Animated.ScrollView>();
  const rightRef = useAnimatedRef<Animated.ScrollView>();

  const y = useSharedValue(0);
  const crop = useSharedValue(0);
  const src = useSharedValue<0 | 1 | null>(null);
  const isScrolling = useSharedValue(false);

  const onScrollLeft = useAnimatedScrollHandler({
    onBeginDrag: () => {
      src.value = 0;
      isScrolling.value = true;
    },
    onScroll: e => {
      if (src.value === 0) {
        y.value = e.contentOffset.y;
      }
    },
    onEndDrag: () => {
      isScrolling.value = false;
    },
    onMomentumEnd: () => {
      isScrolling.value = false;
      src.value = null;
    },
  });

  const onScrollRight = useAnimatedScrollHandler({
    onBeginDrag: () => {
      src.value = 1;
      isScrolling.value = true;
    },
    onScroll: e => {
      if (src.value === 1) {
        y.value = e.contentOffset.y;
      }
    },
    onEndDrag: () => {
      isScrolling.value = false;
    },
    onMomentumEnd: () => {
      isScrolling.value = false;
      src.value = null;
    },
  });

  useAnimatedReaction(
    () => ({ y: y.value, src: src.value }),
    (current, previous) => {
      if (current.y !== previous?.y && current.src !== null) {
        if (current.src === 0) {
          scrollTo(rightRef, 0, current.y, false);
        } else if (current.src === 1) {
          scrollTo(leftRef, 0, current.y, false);
        }
      }
    },
    [y, src],
  );

  const onPress = () => {
    crop.value = withTiming(crop.value === 1 ? 0 : 1, { duration: 500 });
  };

  const cropView = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: interpolate(crop.value, [0, 1], [200, 0]),
      zIndex: 10,
      backgroundColor: 'white',
    };
  });

  const content =
    'asdadadasdasdadadasdasdadadasdasdadadasdasdadadasdasdadadasd\n'.repeat(
      200,
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Synced ScrollView Demo</Text>
      </View>

      <View style={styles.scrollContainer}>
        <Animated.ScrollView
          ref={leftRef}
          onScroll={onScrollLeft}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          style={cropView}
          bounces={true}
        >
          <Text style={styles.content}>{content}</Text>
        </Animated.ScrollView>

        <Animated.ScrollView
          ref={rightRef}
          onScroll={onScrollRight}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          style={[styles.rightScroll]}
          bounces={true}
        >
          <Text style={styles.content}>{content}</Text>
        </Animated.ScrollView>
      </View>
      <Button title="ok" onPress={onPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftScroll: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    zIndex: 4,
  },
  rightScroll: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 16,
  },
  divider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});
