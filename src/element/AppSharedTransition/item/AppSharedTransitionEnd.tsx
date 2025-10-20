import { JSX } from 'react';
import { View, ImageProps } from 'react-native';
import Animated from 'react-native-reanimated';

import { TEasingName } from '../type';
import { useReadSize } from '../modules/useReadSize';
import { useSharedTransition } from '../modules/useSharedTransition';

type SharedImageProps = Omit<ImageProps, 'source'> & {
  easing?: TEasingName;
  children?: JSX.Element;
  duration?: number;
};

export function AppSharedTransitionEnd({
  children,
  easing = 'inOut',
  duration = 500,
}: SharedImageProps) {
  const AnimatedFromType = Animated.createAnimatedComponent(
    children?.type as any,
  );
  const { endW, endH, endR } = useReadSize(children);
  const { ready, imgStyle, bgStyle } = useSharedTransition({
    endW,
    endH,
    endR,
    easing,
    duration,
  });

  if (!ready) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <Animated.View style={bgStyle}>
      <AnimatedFromType
        {...children?.props}
        style={[imgStyle, children?.props.style]}
      />
    </Animated.View>
  );
}
