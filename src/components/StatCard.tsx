import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  value: string;
  label: string;
  valueColor: string;
};

/**
 * No raster icon here on purpose: a coloured accent dot plus the number keeps
 * every pill in a row visually identical in size and weight.
 */
function StatCard({ value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.accentDot, { backgroundColor: valueColor }]} />
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    backgroundColor: theme.colors.ui.glass,
    ...theme.shadows.card,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  value: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
  },
});

export default memo(StatCard);
