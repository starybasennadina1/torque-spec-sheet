import { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import theme from '../constants/theme';

/**
 * Press feedback for the working pattern on this stack: the Pressable is the
 * PARENT and drives an Animated.View child through onPressIn/onPressOut.
 * Only `transform` is animated, so useNativeDriver stays safe.
 */
export function usePressScale(enabled: boolean = true) {
  const scale = useRef(new Animated.Value(1)).current;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      scale.stopAnimation();
    };
  }, [scale]);

  const onPressIn = useCallback(() => {
    if (!enabled) {
      return;
    }
    Animated.timing(scale, {
      toValue: 0.98,
      duration: 80,
      useNativeDriver: true,
    }).start();
  }, [enabled, scale]);

  const onPressOut = useCallback(() => {
    if (!enabled) {
      return;
    }
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [enabled, scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
