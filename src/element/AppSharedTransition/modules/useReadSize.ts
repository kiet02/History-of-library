import { JSX, useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';

export function useReadSize(children?: JSX.Element) {
  const { width, height } = useWindowDimensions();

  const { endW, endH, endR } = useMemo(() => {
    const flat = StyleSheet.flatten(children?.props?.style) ?? {};

    let w = width;
    let h = height / 2;
    let r = 0;

    if (flat.width !== undefined) {
      if (typeof flat.width === 'string' && flat.width.endsWith('%')) {
        const percent = parseFloat(flat.width) / 100;
        w = width * percent;
      }
      if (typeof flat.width === 'number') {
        w = flat.width;
      }
    }

    if (flat.height !== undefined) {
      if (typeof flat.height === 'string' && flat.height.endsWith('%')) {
        const percent = parseFloat(flat.height) / 100;
        h = height * percent;
      }
      if (typeof flat.height === 'number') {
        h = flat.height;
      }
    }

    // Xử lý borderRadius
    if (typeof flat.borderRadius === 'number') {
      r = flat.borderRadius;
    }

    return { endW: w, endH: h, endR: r };
  }, [children?.props?.style, height, width]);

  return { endW, endH, endR };
}
