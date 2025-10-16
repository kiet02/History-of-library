/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useRef, useState } from 'react';
import { View, Image, Pressable, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TStack } from '@navigation/type';

const TEST_IMG = require('@utils/resource/image/test.jpg');
const hw = 300;
const hh = 200;
export default function ListScreen() {
  const [hide, setHide] = useState<number | null>(null);
  const navigation = useNavigation<TStack>();
  const refs = useRef<Record<number, View | null>>({});

  useFocusEffect(
    useCallback(() => {
      setHide(null);
      return () => {};
    }, []),
  );

  const onPress = (index: number) => {
    refs.current[index]?.measureInWindow((x, y) => {
      requestAnimationFrame(() => {
        setHide(index);
      });
      navigation.push('SharedTransitionScreen', {
        item: {
          mediaUrl: TEST_IMG,
          mediaSpecs: {
            width: hw,
            height: hh,
            pageX: x,
            pageY: y,
            borderRadius: 20,
          },
        },
      });
    });
  };

  const Item = ({ index }: { index: number }) => (
    <Pressable
      ref={el => {
        refs.current[index] = el;
      }}
      onPress={() => onPress(index)}
      style={{
        marginVertical: 10,
      }}
    >
      <Image
        source={TEST_IMG}
        style={{
          width: hw,
          height: hh,
          borderRadius: 20,
          opacity: hide === index ? 0 : 1,
        }}
      />
    </Pressable>
  );
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Item key={i} index={i} />
        ))}
      </View>
    </ScrollView>
  );
}
