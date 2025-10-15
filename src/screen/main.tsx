/* eslint-disable react-native/no-inline-styles */
import { useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  ScrollView,
  Text,
} from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

const ITEM_HEIGHT = 100;
const ITEM_MARGIN = 12;
const PADDING_VERTICAL = 12;
const N = 30;
// export const bottomRef = createRef<BottomSheetMethods>();

export function Main() {
  const [scrollY, setScrollY] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const contentRef = useRef<View>(null);
  const contentTopOnScreen = useRef(0);

  const measureContentTop = () => {
    contentRef.current?.measureInWindow?.((_x, y) => {
      contentTopOnScreen.current = y;
    });
  };

  useEffect(() => {
    requestAnimationFrame(measureContentTop);
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(e.nativeEvent.contentOffset.y);
  };

  const addSelectedItem = (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>,
  ) => {
    const yInContent =
      e.absoluteY -
      contentTopOnScreen.current +
      scrollY -
      PADDING_VERTICAL -
      20;

    let index = Math.floor(yInContent / (ITEM_HEIGHT + ITEM_MARGIN));
    if (index < 0) index = 0;
    if (index >= N) index = N - 1;
    setSelectedItems(prev => {
      if (prev.has(index)) return prev;
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  //   const resetSelectedItems = () => {
  //     setSelectedItems(new Set());
  //   };

  const pan = Gesture.Pan()
    .onStart(e => {
      scheduleOnRN(addSelectedItem, e);

      console.log('start');
    })
    .onUpdate(e => {
      scheduleOnRN(addSelectedItem, e);
    })
    .onEnd(() => {})
    .activateAfterLongPress(300);

  return (
    <GestureDetector gesture={pan}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: PADDING_VERTICAL }}
      >
        <View ref={contentRef} onLayout={measureContentTop}>
          {Array.from({ length: N }, (_, i) => (
            <View
              key={i}
              style={{
                alignSelf: 'center',
                width: 200,
                height: ITEM_HEIGHT,
                marginBottom: ITEM_MARGIN,
                borderRadius: 12,
                backgroundColor: selectedItems.has(i) ? '#4ade80' : '#2d2d2d',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff' }}>Item {i}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </GestureDetector>
  );
}
