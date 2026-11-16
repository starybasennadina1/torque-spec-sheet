import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';
import {
  APP_NAME,
  LOADER_DURATION_MS,
  LOADER_PROGRESS_DELAY_MS,
  LOADER_PROGRESS_MS,
} from '../constants/config';
import WorkshopBackground from '../components/WorkshopBackground';

const RAIL_W = 180;

type Props = {
  onDone: () => void;
};

/**
 * Branded splash. Darker overlay, no navigation tiles and no start button,
 * so it never reads as the hub.
 */
function LoaderScreen({ onDone }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const entrance = Animated.timing(enter, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    });
    const fill = Animated.timing(progress, {
      toValue: 1,
      delay: LOADER_PROGRESS_DELAY_MS,
      duration: LOADER_PROGRESS_MS,
      useNativeDriver: true,
    });
    entrance.start();
    fill.start();

    const timer = setTimeout(() => doneRef.current(), LOADER_DURATION_MS);
    return () => {
      clearTimeout(timer);
      entrance.stop();
      fill.stop();
    };
  }, [enter, progress]);

  const brandScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });

  return (
    <WorkshopBackground variant="loader">
      <View style={styles.root}>
        <Image
          source={assets.sprite2}
          style={styles.decor}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.brand, { opacity: enter, transform: [{ scale: brandScale }] }]}>
          <View style={styles.mark}>
            <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {APP_NAME}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            Convert. Save. Tighten with confidence.
          </Text>
        </Animated.View>

        <View style={styles.progressBlock}>
          <View style={styles.rail}>
            <Animated.View
              style={[
                styles.fill,
                {
                  transform: [
                    { translateX: -RAIL_W / 2 },
                    { scaleX: progress },
                    { translateX: RAIL_W / 2 },
                  ],
                },
              ]}
            />
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </View>
    </WorkshopBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  decor: {
    position: 'absolute',
    top: 72,
    width: 200,
    height: 200,
    opacity: 0.1,
  },
  brand: {
    alignItems: 'center',
  },
  mark: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: 'rgba(42, 157, 171, 0.14)',
    marginBottom: 24,
  },
  logo: {
    width: 76,
    height: 76,
  },
  title: {
    ...theme.typography.hero,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 12,
  },
  progressBlock: {
    position: 'absolute',
    bottom: 96,
    alignItems: 'center',
    gap: 12,
  },
  rail: {
    width: RAIL_W,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.bg.tertiary,
    overflow: 'hidden',
  },
  fill: {
    width: RAIL_W,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.accent.primary,
  },
  loading: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    letterSpacing: 2,
  },
});

export default LoaderScreen;
