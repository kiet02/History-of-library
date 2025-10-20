import React from 'react';
import { AppSharedTransitionEnd, AppSharedTransitionStart } from './item';
import { TEasingName } from './type';

export type SharedTransitionTag = 'start' | 'end';

type EndSpecificProps = {
  easing?: TEasingName;
  duration?: number;
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
      <AppSharedTransitionEnd easing={props.easing} duration={props.duration}>
        {props.children}
      </AppSharedTransitionEnd>
    );
  }

  return null;
}
