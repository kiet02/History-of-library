import React, { useEffect } from 'react';
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
import { TStack } from '@navigation/type';
import { useFormContext, useWatch } from 'react-hook-form';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(RNImage);
const DURATION = 500;

type SharedImageProps = ImageProps & {
  disableClose?: boolean;
  onClose?: () => void;
  targetWidth?: number;
  targetHeight?: number;
  overlayMaxOpacity?: number;
  children?: React.ReactNode;
  easing?: EasingFunction | EasingFunctionFactory;
};

function SharedTransitionImage(props: SharedImageProps): React.JSX.Element {
  const {
    disableClose,
    onClose,
    targetWidth = SCREEN_WIDTH,
    targetHeight = SCREEN_HEIGHT / 2,
    overlayMaxOpacity = 0.35,
    style,
    resizeMode,
    children,
    easing = Easing.out(Easing.quad),
    ...rest
  } = props;

  const navigation = useNavigation<TStack>();
  const { control } = useFormContext();

  const [pageXRaw, pageYRaw, wRaw, hRaw, borderRadius] = useWatch({
    control,
    name: ['pageX', 'pageY', 'width', 'height', 'borderRadius'],
  });

  // Fallback để tránh NaN
  const pageX = Number.isFinite(pageXRaw) ? pageXRaw : 0;
  const pageY = Number.isFinite(pageYRaw) ? pageYRaw : 0;
  const startW = Number.isFinite(wRaw) ? wRaw : targetWidth;
  const startH = Number.isFinite(hRaw) ? hRaw : targetHeight;

  const insets = useSafeAreaInsets();
  const t = useSharedValue(0);
  const overlay = useSharedValue(0);

  useEffect(() => {
    navigation?.setOptions({
      presentation: 'transparentModal',
      animation: 'fade',
    });

    t.value = withTiming(1, {
      duration: DURATION,
      easing,
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
  }, [t, overlay, overlayMaxOpacity, navigation, easing]);

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

  const imgStyle = useAnimatedStyle(() => {
    const bor = borderRadius ?? 0;
    return {
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
      borderRadius: interpolate(t.value, [0, 1], [bor, 0], Extrapolation.CLAMP),
      zIndex: 2,
    };
  });

  const backgroundStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(
      overlay.value,
      [0, overlayMaxOpacity],
      ['rgba(0,0,0,0)', 'rgba(0,0,0,1)'],
    ),
  }));

  return (
    <Animated.View style={backgroundStyle}>
      <Pressable onPress={close}>
        <AnimatedImage
          {...rest}
          exiting={FadeOut}
          resizeMode={resizeMode ?? 'cover'}
          style={[style, imgStyle]}
        />

        {children ? (
          <View
            pointerEvents="box-none"
            style={{
              flex: 1,
              zIndex: 3,
            }}
          >
            {children}
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}
SharedTransitionImage.displayName = 'Image';

export const SharedTransitionScreen = {
  Image: SharedTransitionImage,
};
