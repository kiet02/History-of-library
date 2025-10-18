import React from 'react';
import { AppSharedTransitionEnd, AppSharedTransitionStart } from './item';

export type SharedTransitionTag = 'start' | 'end';

type EndSpecificProps = {
  source?: any;
  disableClose?: boolean;
  onClose?: () => void;
  targetWidth?: number;
  targetHeight?: number;
  overlayMaxOpacity?: number;
  easing?: 'linear' | 'inOutQuad' | 'inOutCubic' | 'outQuad' | 'outCubic';
};

export type AppSharedTransitionProps =
  | {
      tag: 'start';
      children: React.ReactElement;
    }
  | ({
      tag: 'end';
      children?: React.ReactElement;
    } & EndSpecificProps);

export function AppSharedTransition(props: AppSharedTransitionProps) {
  if (props.tag === 'start') {
    return (
      <AppSharedTransitionStart>{props.children}</AppSharedTransitionStart>
    );
  }

  if (props.tag === 'end') {
    return (
      <AppSharedTransitionEnd easing={props.easing}>
        {props.children}
      </AppSharedTransitionEnd>
    );
  }

  return null;
}
