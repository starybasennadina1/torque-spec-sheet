import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { CROSSFADE_MS } from '../constants/config';
import { UNIT_LONG, type Unit } from '../game/torqueConversion';

type Props = {
  unit: Unit;
  value: string;
  caption?: string;
  highlighted?: boolean;
  big?: boolean;
};

/** Values appear at their final number - no counting through intermediates. */
function ValueCard({ unit, value, caption, highlighted = false, big = false }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    opacity.setValue(0.35);
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration: CROSSFADE_MS,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [opacity, value, unit]);

  return (
    <View
      style={[styles.card, highlighted ? styles.cardHighlighted : null]}
      accessible
      accessibilityLabel={value + ' ' + UNIT_LONG[unit]}>
      <Text style={styles.unit} numberOfLines={1}>
        {unit.toUpperCase()}
      </Text>
      <Animated.View pointerEvents="none" style={{ opacity }}>
        <Text
          style={[
            big ? styles.valueBig : styles.value,
            highlighted ? styles.valueHighlighted : null,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {value}
        </Text>
      </Animated.View>
      {caption ? (
        <Text style={styles.caption} numberOfLines={1}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 88,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    gap: 2,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glass,
    ...theme.shadows.card,
  },
  cardHighlighted: {
    borderColor: theme.colors.accent.primary,
    borderWidth: 2,
  },
  unit: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  value: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  valueBig: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  valueHighlighted: {
    color: theme.colors.accent.secondary,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
});

export default memo(ValueCard);
