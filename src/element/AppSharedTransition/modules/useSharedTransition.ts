import { useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Easing,
  Extrapolation,
  ReduceMotion,
  cancelAnimation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFormContext, useWatch } from 'react-hook-form';
import { EASING_MAP, TEasingName } from '../type';

const DURATION = 500;

type UseSharedTransitionParams = {
  endW: number;
  endH: number;
  endR: number;
  easing?: TEasingName;
  duration?: number;
};

export function useSharedTransition({
  endW,
  endH,
  endR,
  easing = 'inOut',
  duration = DURATION,
}: UseSharedTransitionParams) {
  const navigation = useNavigation();
  const { control } = useFormContext();
  const insets = useSafeAreaInsets();

  const t = useSharedValue(0);
  const overlay = useSharedValue(0);

  const [pageXRaw, pageYRaw, wRaw, hRaw, borderRadiusStart] = useWatch({
    control,
    name: ['pageX', 'pageY', 'width', 'height', 'borderRadius'],
    defaultValue: [0, 0, 0, 0, 0],
  });

  const ready = wRaw > 0 && hRaw > 0;

  const easingFn = useMemo(() => {
    if (typeof easing === 'string') {
      return EASING_MAP[easing] ?? Easing.out(Easing.quad);
    }
    return easing;
  }, [easing]);

  useEffect(() => {
    if (!ready) return;

    navigation.setOptions?.({
      presentation: 'transparentModal',
      animation: 'none',
    });

    t.value = withTiming(100, {
      duration,
      easing: easingFn,
      reduceMotion: ReduceMotion.System,
    });

    return () => {
      cancelAnimation(t);
      cancelAnimation(overlay);
    };
  }, [ready, navigation, t, overlay, easingFn, duration]);

  useEffect(() => {
    if (!ready) return;

    let isClosing = false;

    const doCloseJS = (action?: any) => {
      if (action) navigation.dispatch?.(action);
      else navigation.goBack?.();
    };

    const onBeforeRemove = (e: any) => {
      if (isClosing) return;
      e.preventDefault();
      isClosing = true;

      overlay.value = withTiming(0, { duration });
      t.value = withTiming(0, { duration }, finished => {
        'worklet';
        if (finished) {
          runOnJS(doCloseJS)(e?.data?.action);
        } else {
          runOnJS(doCloseJS)(e?.data?.action);
        }
      });
    };

    const unsub = navigation.addListener?.('beforeRemove', onBeforeRemove);
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [ready, navigation, t, overlay, duration]);

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
      ['rgba(0,0,0,0)', 'rgba(100,0,0,1)'],
    ),
  }));

  return {
    ready,
    imgStyle,
    bgStyle,
    t,
    overlay,
  };
}
