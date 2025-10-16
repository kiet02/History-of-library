/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { Dimensions, Pressable, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  Extrapolation,
  interpolateColor,
  FadeOut,
  cancelAnimation,
  ReduceMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { TRoute, TStack } from '@navigation/type';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedImage = Animated.createAnimatedComponent(Image);
const DURATION = 500;

export default function SharedTransitionScreen() {
  const navigation = useNavigation<TStack>();
  const { params } = useRoute<TRoute<'SharedTransitionScreen'>>();
  const insets = useSafeAreaInsets();
  const { mediaUrl, mediaSpecs } = params.item;

  const t = useSharedValue(0);
  const overlay = useSharedValue(0);

  useEffect(() => {
    t.value = withTiming(1, {
      duration: DURATION,
      easing: Easing.out(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
    overlay.value = withTiming(0.35, { duration: DURATION });

    return () => {
      cancelAnimation(t);
      cancelAnimation(overlay);
    };
  }, [t, overlay]);

  const close = () => {
    overlay.value = withTiming(0, { duration: DURATION });
    t.value = withTiming(0, { duration: DURATION }, finished => {
      if (finished) {
        scheduleOnRN(navigation.goBack);
      }
    });
  };

  const imgStyle = useAnimatedStyle(() => {
    const bor = mediaSpecs.borderRadius ?? 0;
    return {
      position: 'absolute',
      left: interpolate(
        t.value,
        [0, 1],
        [mediaSpecs.pageX, 0],
        Extrapolation.CLAMP,
      ),
      top: interpolate(
        t.value,
        [0, 1],
        [mediaSpecs.pageY + insets.top, 0],
        Extrapolation.CLAMP,
      ),
      width: interpolate(
        t.value,
        [0, 1],
        [mediaSpecs.width, SCREEN_WIDTH],
        Extrapolation.CLAMP,
      ),
      height: interpolate(
        t.value,
        [0, 1],
        [mediaSpecs.height, SCREEN_HEIGHT],
        Extrapolation.CLAMP,
      ),
      borderRadius: interpolate(t.value, [0, 1], [bor, 0], Extrapolation.CLAMP),
    };
  });

  const overlayStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(
      overlay.value,
      [0, 0.35],
      ['rgba(255,255,255,0)', 'black'],
    ),
  }));

  return (
    <Animated.View style={overlayStyle}>
      <Pressable onPress={close}>
        <AnimatedImage
          exiting={FadeOut}
          style={imgStyle}
          source={mediaUrl}
          resizeMode="cover"
        />
      </Pressable>
    </Animated.View>
  );
}
