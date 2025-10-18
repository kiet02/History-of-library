/* eslint-disable react-native/no-inline-styles */
import React, { JSX, useEffect, useMemo, useRef } from 'react';
import { Dimensions, Image, ImageProps, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  Easing,
  Extrapolation,
  ReduceMotion,
  cancelAnimation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  EasingFunction,
  runOnJS, // ✅ đúng: import từ reanimated
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFormContext, useWatch } from 'react-hook-form';
import { TStack } from '@navigation/type';

const { width: SW, height: SH } = Dimensions.get('window');
const DURATION = 500;

type EasingKey = 'linear' | 'inOutQuad' | 'inOutCubic' | 'outQuad' | 'outCubic';
const EASING_MAP: Record<EasingKey, EasingFunction> = {
  linear: Easing.linear,
  inOutQuad: Easing.inOut(Easing.quad),
  inOutCubic: Easing.inOut(Easing.cubic),
  outQuad: Easing.out(Easing.quad),
  outCubic: Easing.out(Easing.cubic),
};

type SharedImageProps = Omit<ImageProps, 'source'> & {
  easing?: EasingKey | EasingFunction;
  children?: JSX.Element;
};

export function AppSharedTransitionEnd({
  children,
  easing = 'outQuad',
}: SharedImageProps) {
  const AnimatedImage = Animated.createAnimatedComponent(Image);
  const AnimatedFromType = Animated.createAnimatedComponent(
    children?.type as any,
  );

  const navigation = useNavigation<TStack>();
  const { control } = useFormContext();
  const insets = useSafeAreaInsets();

  const [pageXRaw, pageYRaw, wRaw, hRaw, borderRadiusStart] = useWatch({
    control,
    name: ['pageX', 'pageY', 'width', 'height', 'borderRadius'],
    defaultValue: [0, 0, 0, 0, 0],
  });
  const ready = wRaw > 0 && hRaw > 0;

  const { endW, endH, endR } = useMemo(() => {
    const flat = StyleSheet.flatten(children?.props?.style) ?? {};
    const w = typeof flat.width === 'number' ? flat.width : SW;
    const h = typeof flat.height === 'number' ? flat.height : SH / 2;
    const r = typeof flat.borderRadius === 'number' ? flat.borderRadius : 0;
    return { endW: w, endH: h, endR: r };
  }, [children]);

  const t = useSharedValue(0);
  const overlay = useSharedValue(0);
  const ref = useRef<View>(null);
  const easingFn = useMemo<EasingFunction>(() => {
    if (typeof easing === 'string')
      return EASING_MAP[easing] ?? Easing.out(Easing.quad);
    return easing;
  }, [easing]);

  useEffect(() => {
    if (!ready) return;

    navigation.setOptions?.({
      presentation: 'transparentModal',
      animation: 'none',
    });

    t.value = withTiming(100, {
      duration: DURATION,
      easing: easingFn,
      reduceMotion: ReduceMotion.System,
    });

    return () => {
      cancelAnimation(t);
      cancelAnimation(overlay);
    };
  }, [ready, navigation, t, overlay, easingFn]);

  useEffect(() => {
    if (!ready) return;

    const closingRef = { current: false };
    const setClosing = (v: boolean) => {
      closingRef.current = v;
    };

    const doCloseJS = (action?: any) => {
      if (action) navigation.dispatch?.(action);
      else navigation.goBack?.();
    };

    const onBeforeRemove = (e: any) => {
      if (closingRef.current) return;
      e.preventDefault();
      closingRef.current = true;

      overlay.value = withTiming(0, { duration: DURATION });
      t.value = withTiming(0, { duration: DURATION }, finished => {
        'worklet';
        if (finished) {
          runOnJS(doCloseJS)(e?.data?.action);
        } else {
          runOnJS(doCloseJS)(e?.data?.action);
        }
        runOnJS(setClosing)(false);
      });
    };

    const unsub = navigation.addListener?.('beforeRemove', onBeforeRemove);
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [ready, navigation, t, overlay]);

  const imgStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: interpolate(t.value, [0, 100], [pageXRaw, 0], Extrapolation.CLAMP),
    top: interpolate(
      t.value,
      [0, 100],
      [pageYRaw + insets.top, 0],
      Extrapolation.CLAMP,
    ),
    width: interpolate(t.value, [0, 100], [wRaw, endW], Extrapolation.CLAMP),
    height: interpolate(t.value, [0, 100], [hRaw, endH], Extrapolation.CLAMP),
    borderRadius: interpolate(
      t.value,
      [0, 100],
      [borderRadiusStart, endR],
      Extrapolation.CLAMP,
    ),
    zIndex: 2,
  }));

  const bgStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(
      overlay.value,
      [0, 1],
      ['rgba(0,0,0,0)', `rgba(0,0,0,1)`],
    ),
  }));

  if (!ready) return <View style={{ flex: 1 }} />;

  return (
    <Animated.View style={bgStyle}>
      {children?.type === Image ? (
        <AnimatedImage
          ref={ref}
          {...children.props}
          style={[imgStyle, children.props.style]}
        />
      ) : (
        <AnimatedFromType
          ref={ref}
          {...children?.props}
          style={[imgStyle, children?.props.style]}
        />
      )}
    </Animated.View>
  );
}
