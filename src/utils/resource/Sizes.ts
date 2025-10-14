import { useWindowDimensions, PixelRatio } from 'react-native';

export function useSizes() {
  const { width, height, fontScale } = useWindowDimensions();

  const wp = (per: number) => PixelRatio.roundToNearestPixel((width * per) / 100);
  const hp = (per: number) => PixelRatio.roundToNearestPixel((height * per) / 100);
  const wpx = (px: number) => PixelRatio.roundToNearestPixel(px);

  return {
    wp,
    hp,
    wpx,
    deviceWidth: width,
    deviceHeight: height,
    fontScale,
  };
}
