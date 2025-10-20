import React, { JSX, useCallback, useRef } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { useFormContext } from 'react-hook-form';

export type AppSharedTransitionStartProps = ViewProps & {
  children: JSX.Element;
  style?: ViewProps['style'];
};

export function AppSharedTransitionStart({
  children,
  style,
  ...viewProps
}: AppSharedTransitionStartProps) {
  const { setValue } = useFormContext();
  const ref = useRef<View>(null);
  const opacity = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      opacity.value = withTiming(1, { duration: 0 });
      return () => {
        ref.current?.measureInWindow((x, y, width, height) => {
          const flattenedStyle = StyleSheet.flatten(children.props?.style);
          const extractedBorderRadius =
            typeof flattenedStyle?.borderRadius === 'number'
              ? flattenedStyle.borderRadius
              : 0;

          setValue('pageX', x);
          setValue('pageY', y);
          setValue('width', width);
          setValue('height', height);
          setValue('borderRadius', extractedBorderRadius);
          requestAnimationFrame(() => {
            opacity.value = 0;
          });
        });
      };
    }, [children.props?.style, setValue, opacity]),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      {...viewProps}
      ref={ref}
      style={[styles.container, style, animatedStyle]}
      collapsable={false}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
});
