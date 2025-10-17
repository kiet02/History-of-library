import { AppSharedTransitionEnd } from '@element/AppSharedTransition';

const TEST_IMG = require('@utils/resource/image/test.jpg');
export function Test() {
  return (
    <AppSharedTransitionEnd
      source={TEST_IMG}
      // targetHeight={200}
      // targetWidth={200}
      easing={'ease'}
    />
  );
}
