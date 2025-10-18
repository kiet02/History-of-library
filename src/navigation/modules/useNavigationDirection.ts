import { useNavigationState, useFocusEffect } from '@react-navigation/native';
import { useRef, useCallback, useState } from 'react';

export function useNavigationDirection() {
  const previousLengthRef = useRef<number | null>(null);
  const [direction, setDirection] = useState<'forward' | 'back' | 'initial'>(
    'initial',
  );

  const navigationInfo = useNavigationState(state => {
    const currentIndex = state.index;
    const routes = state.routes;
    const currentRoute = routes[currentIndex];
    const previousRoute = currentIndex > 0 ? routes[currentIndex - 1] : null;

    return {
      direction,
      currentRoute,
      previousRoute,
      currentIndex,
      totalScreens: routes.length,
      routes,
    };
  });

  useFocusEffect(
    useCallback(() => {
      const currentLength = navigationInfo.totalScreens;

      if (previousLengthRef.current !== null) {
        if (currentLength > previousLengthRef.current) {
          setDirection('forward');
          console.log('✅ Navigation: FORWARD');
        } else if (currentLength < previousLengthRef.current) {
          setDirection('back');
          console.log('⬅️ Navigation: BACK');
        }
      } else {
        // First time, check if not first screen
        if (navigationInfo.currentIndex > 0) {
          setDirection('forward');
          console.log('✅ Navigation: FORWARD (initial)');
        }
      }

      previousLengthRef.current = currentLength;
    }, [navigationInfo.totalScreens, navigationInfo.currentIndex]),
  );

  return navigationInfo;
}
