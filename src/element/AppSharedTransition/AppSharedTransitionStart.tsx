import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Pressable,
  LayoutRectangle,
  findNodeHandle,
  UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFormContext } from 'react-hook-form';
import { TStack } from '@navigation/type';

export type AppSharedTransitionStartProps = {
  /** children hiển thị (ảnh, card, v.v.) */
  children: React.ReactNode;
  /** tên screen muốn navigate tới */
  targetScreen: keyof TStack;
  /** dữ liệu params truyền sang màn End */
  params?: Record<string, any>;
  /** bo góc, nếu cần giữ hình dạng khi chuyển */
  borderRadius?: number;
  /** callback phụ (nếu muốn chạy sau khi đo xong) */
  onBeforeNavigate?: (layout: LayoutRectangle) => void;
  /** style container ngoài cùng */
  style?: object;
};

export function AppSharedTransitionStart({
  children,
  targetScreen,
  params,
  borderRadius = 0,
  onBeforeNavigate,
  style,
}: AppSharedTransitionStartProps) {
  const navigation = useNavigation<TStack>();
  const { setValue } = useFormContext();
  const ref = useRef<View>(null);
  const [hidden, setHidden] = useState(false);

  const onPress = useCallback(() => {
    const node = findNodeHandle(ref.current);
    if (!node) return;

    UIManager.measureInWindow(node, (x, y, width, height) => {
      // Lưu vào form (để End đọc)
      setValue('pageX', x);
      setValue('pageY', y);
      setValue('width', width);
      setValue('height', height);
      setValue('borderRadius', borderRadius);

      onBeforeNavigate?.({ x, y, width, height });
      setHidden(true);
      navigation.push(targetScreen, params);
    });
  }, [
    navigation,
    setValue,
    targetScreen,
    params,
    borderRadius,
    onBeforeNavigate,
  ]);

  return (
    <View
      ref={ref}
      style={[{ opacity: hidden ? 0 : 1 }, style]}
      collapsable={false}
    >
      <Pressable onPress={onPress}>{children}</Pressable>
    </View>
  );
}
