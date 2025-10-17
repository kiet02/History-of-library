import {
  Easing,
  EasingFunction,
  EasingFunctionFactory,
} from 'react-native-reanimated';

export type TEasingName =
  | 'linear'
  | 'ease'
  | 'quad'
  | 'cubic'
  | 'sin'
  | 'circle'
  | 'exp'
  | 'bounce'
  | 'elastic'
  | 'back'
  | 'in'
  | 'out'
  | 'inOut';

export const EASING_MAP: Record<
  TEasingName,
  EasingFunction | EasingFunctionFactory
> = {
  linear: Easing.linear,
  ease: Easing.ease,
  quad: Easing.out(Easing.quad),
  cubic: Easing.out(Easing.cubic),
  sin: Easing.out(Easing.sin),
  circle: Easing.out(Easing.circle),
  exp: Easing.out(Easing.exp),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1.2), // có thể tuỳ chỉnh độ đàn hồi
  back: Easing.bezier(0.68, -0.55, 0.27, 1.55), // giống easeOutBack
  in: Easing.in(Easing.quad),
  out: Easing.out(Easing.quad),
  inOut: Easing.inOut(Easing.quad),
};
