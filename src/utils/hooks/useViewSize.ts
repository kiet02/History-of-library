import { useState, useCallback } from 'react';

export const useViewSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = useCallback(
    (event: { nativeEvent: { layout: { width: any; height: any } } }) => {
      const { width, height } = event.nativeEvent.layout;
      setSize({ width, height });
    },
    [],
  );

  return { size, onLayout };
};
