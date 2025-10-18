/* eslint-disable react-native/no-inline-styles */
import React, { JSX, useCallback, useRef, useState } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFormContext } from 'react-hook-form';
import { RootStackParamList } from '@navigation/type';
import { scheduleOnRN } from 'react-native-worklets';

export type AppSharedTransitionStartProps = ViewProps & {
  children: JSX.Element;
  borderRadius?: number;
  style?: ViewProps['style'];
  params?: RootStackParamList[keyof RootStackParamList];
};

export function AppSharedTransitionStart({
  children,
  style,
  ...viewProps
}: AppSharedTransitionStartProps) {
  const { setValue } = useFormContext();
  const ref = useRef<View>(null);
  const [hidden, setHidden] = useState(false);

  useFocusEffect(
    useCallback(() => {
      requestAnimationFrame(() => {
        scheduleOnRN(setHidden, false);
      });
      return () => {
        ref.current?.measureInWindow((x, y, width, height) => {
          const flattenedStyle = StyleSheet.flatten(children.props?.style);
          const extractedBorderRadius = flattenedStyle?.borderRadius ?? 0;

          setValue('pageX', x);
          setValue('pageY', y);
          setValue('width', width);
          setValue('height', height);
          setValue('borderRadius', extractedBorderRadius);
          requestAnimationFrame(() => {
            scheduleOnRN(setHidden, true);
          });
        });
      };
    }, [children.props?.style, setValue]),
  );

  return (
    <View
      {...viewProps}
      ref={ref}
      style={[
        {
          opacity: hidden ? 0 : 1,
          alignSelf: 'flex-start',
          overflow: 'hidden',
        },
        style,
      ]}
      collapsable={false}
    >
      {children}
    </View>
  );
}
