import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  scrollTo,
  interpolate,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { focusManager, useIsFetching, useQuery } from '@tanstack/react-query';
import { fetchPosts, HpBook } from '@utils/fetch/FetchApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TStack } from '@navigation/type';

export function Main() {
  const leftRef = useAnimatedRef<Animated.ScrollView>();
  const rightRef = useAnimatedRef<Animated.ScrollView>();

  const show = useSharedValue(1);
  const y = useSharedValue(0);
  const src = useSharedValue<null | 0 | 1>(null);
  const navi = useNavigation<TStack>();

  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 1000,
    refetchOnMount: false,
    refetchInterval: 1000,
  });

  const isFetching = useIsFetching({ queryKey: ['posts'] });
  if (isFetching) console.log(isFetching, 'isRefetching');

  useFocusEffect(
    useCallback(() => {
      focusManager.setFocused(true);
      return () => {
        focusManager.setFocused(false);
      };
    }, []),
  );

  const onScrollLeft = useAnimatedScrollHandler({
    onBeginDrag: () => {
      src.value = 0;
    },
    onScroll: e => {
      if (src.value === 0) y.value = e.contentOffset.y;
    },
    onMomentumEnd: () => {
      src.value = null;
    },
  });

  const onScrollRight = useAnimatedScrollHandler({
    onBeginDrag: () => {
      src.value = 1;
    },
    onScroll: e => {
      if (src.value === 1) y.value = e.contentOffset.y;
    },
    onMomentumEnd: () => {
      src.value = null;
    },
  });

  useAnimatedReaction(
    () => ({ y: y.value, src: src.value }),
    (cur, prev) => {
      if (cur.src === null) return;
      if (prev && cur.y === prev.y) return;

      if (cur.src === 0) {
        scrollTo(rightRef, 0, cur.y, false);
      } else {
        scrollTo(leftRef, 0, cur.y, false);
      }
    },
    [y, src],
  );

  const overlayWidth = 440;

  const overlayStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: interpolate(show.value, [0, 1], [overlayWidth, 0]),
      overflow: 'hidden',
    };
  });

  const onToggleOverlay = () => {
    show.value = withTiming(
      show.value === 1 ? 0 : 1,
      { duration: 350 },
      () => {},
    );
    runOnJS(() => navi.navigate('ListScreen'))();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Overlayed Synced ScrollViews</Text>
      </View>

      <View style={styles.stage}>
        <Animated.ScrollView
          ref={rightRef}
          onScroll={onScrollRight}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator
          style={styles.rightScroll}
          contentContainerStyle={styles.contentWrap}
        >
          {data?.map((e: HpBook) => (
            <Text key={e.index} style={styles.contentText}>
              [RIGHT]{'\n'}
              {e.title}
              {'\n'}
              {'\n'}
              {e.description}
            </Text>
          ))}
        </Animated.ScrollView>

        <Animated.View style={[styles.overlayWrapper, overlayStyle]}>
          <Animated.ScrollView
            ref={leftRef}
            onScroll={onScrollLeft}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator
            style={styles.leftScroll}
            contentContainerStyle={styles.contentWrap}
          >
            {data?.map((e: HpBook) => (
              <Text key={e.index} style={styles.contentText}>
                [LEFT]{'\n'}
                {e.title}
                {'\n'}
                {'\n'}
                {e.description}
              </Text>
            ))}
          </Animated.ScrollView>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Button title="Toggle Overlay" onPress={onToggleOverlay} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9' },
  header: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E3E4E8',
  },
  headerText: { textAlign: 'center', fontSize: 16, fontWeight: '600' },

  stage: { flex: 1, position: 'relative' },

  rightScroll: { width: 415, backgroundColor: '#FAFAFA' },
  leftScroll: { width: 415, backgroundColor: 'gray' },

  overlayWrapper: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#DADDE3',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  contentWrap: { paddingHorizontal: 16, paddingVertical: 10 },
  contentText: { fontSize: 14, lineHeight: 20, color: '#333' },

  footer: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E3E4E8',
  },
});
