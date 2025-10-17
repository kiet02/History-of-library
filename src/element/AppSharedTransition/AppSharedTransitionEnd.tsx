/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo } from 'react';
import {
  Dimensions,
  Pressable,
  Image as RNImage,
  ImageProps,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  Extrapolation,
  FadeOut,
  cancelAnimation,
  ReduceMotion,
  interpolateColor,
  EasingFunction,
  EasingFunctionFactory,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { useFormContext, useWatch } from 'react-hook-form';
import { TStack } from '@navigation/type';
import { EASING_MAP } from './type';

const { width: SW, height: SH } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(RNImage);
const DURATION = 500;

type SharedImageProps = Omit<ImageProps, 'source'> & {
  source?: ImageProps['source'];
  disableClose?: boolean;
  onClose?: () => void;
  targetWidth?: number;
  targetHeight?: number;
  overlayMaxOpacity?: number; // 0..1
  easing?: keyof typeof EASING_MAP | EasingFunction | EasingFunctionFactory;
  children?: React.ReactNode;
};

function AppSharedTransitionEnd(props: SharedImageProps): React.JSX.Element {
  const {
    source,
    style,
    resizeMode,
    children,
    disableClose,
    onClose,
    targetWidth = SW,
    targetHeight = SH / 2,
    overlayMaxOpacity = 0.35,
    easing = Easing.out(Easing.quad),
    ...rest
  } = props;

  const navigation = useNavigation<TStack>();
  const { control } = useFormContext();
  const [pageXRaw, pageYRaw, wRaw, hRaw, borderRadius] = useWatch({
    control,
    name: ['pageX', 'pageY', 'width', 'height', 'borderRadius'],
  });

  // safe numbers (tránh NaN)
  const pageX = Number.isFinite(pageXRaw as number) ? (pageXRaw as number) : 0;
  const pageY = Number.isFinite(pageYRaw as number) ? (pageYRaw as number) : 0;
  const startW = Number.isFinite(wRaw as number)
    ? (wRaw as number)
    : targetWidth;
  const startH = Number.isFinite(hRaw as number)
    ? (hRaw as number)
    : targetHeight;
  const bor = Number.isFinite(borderRadius as number)
    ? (borderRadius as number)
    : 0;

  const insets = useSafeAreaInsets();
  const t = useSharedValue(0);
  const overlay = useSharedValue(0);

  // resolve easing 1 lần, tránh tạo lại trong effect
  const easingFn = useMemo(
    () =>
      typeof easing === 'string'
        ? EASING_MAP[easing] ?? Easing.out(Easing.quad)
        : easing,
    [easing],
  );

  useEffect(() => {
    navigation?.setOptions({
      presentation: 'transparentModal',
      animation: 'fade',
    });

    t.value = withTiming(1, {
      duration: DURATION,
      easing: easingFn,
      reduceMotion: ReduceMotion.System,
    });
    overlay.value = withTiming(overlayMaxOpacity, {
      duration: DURATION,
      reduceMotion: ReduceMotion.System,
    });

    return () => {
      cancelAnimation(t);
      cancelAnimation(overlay);
    };
  }, [navigation, t, overlay, easingFn, overlayMaxOpacity]);

  const close = () => {
    if (disableClose) return;
    overlay.value = withTiming(0, { duration: DURATION });
    t.value = withTiming(0, { duration: DURATION }, finished => {
      if (finished) {
        onClose?.();
        scheduleOnRN(navigation.goBack);
      }
    });
  };

  // image transform
  const imgStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: interpolate(t.value, [0, 1], [pageX, 0], Extrapolation.CLAMP),
    top: interpolate(
      t.value,
      [0, 1],
      [pageY + insets.top, 0],
      Extrapolation.CLAMP,
    ),
    width: interpolate(
      t.value,
      [0, 1],
      [startW, targetWidth],
      Extrapolation.CLAMP,
    ),
    height: interpolate(
      t.value,
      [0, 1],
      [startH, targetHeight],
      Extrapolation.CLAMP,
    ),
    backgroundColor: interpolateColor(
      t.value,
      [0, 1],
      ['rgba(0,0,0,0)', `rgba(100,0,0,${overlayMaxOpacity})`],
    ),
    borderRadius: interpolate(t.value, [0, 1], [bor, 0], Extrapolation.CLAMP),

    zIndex: 2,
  }));

  const bgStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(
      overlay.value,
      [0, 1],
      ['rgba(0,0,0,0)', `rgba(0,0,0,${overlayMaxOpacity})`],
    ),
  }));

  return (
    <Animated.View style={bgStyle}>
      <Pressable onPress={close} style={{ flex: 1 }}>
        {source ? (
          <AnimatedImage
            {...rest}
            source={source}
            exiting={FadeOut}
            resizeMode={resizeMode ?? 'cover'}
            style={[style, imgStyle]}
          />
        ) : (
          <Animated.View style={[style, imgStyle]} />
        )}

        {children ? (
          <View pointerEvents="box-none" style={{ flex: 1, zIndex: 3 }}>
            {children}
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

export { AppSharedTransitionEnd };
