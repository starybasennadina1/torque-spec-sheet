import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import theme from '../constants/theme';
import { HIT_SLOP, TOUCH_MIN } from '../constants/config';
import { formatTorque, type Unit } from '../game/torqueConversion';

type Props = {
  id: string;
  name: string;
  nm: number;
  vehicle: string;
  origin: 'custom' | 'reference';
  displayUnit: Unit;
  decimals: number;
  highlighted: boolean;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
};

/** Primitive props only, so the memoised row skips re-render while typing. */
function SpecCard({
  id,
  name,
  nm,
  vehicle,
  origin,
  displayUnit,
  decimals,
  highlighted,
  onOpen,
  onDelete,
}: Props) {
  const handleOpen = useCallback(() => onOpen(id), [id, onOpen]);
  const handleDelete = useCallback(() => onDelete(id), [id, onDelete]);

  return (
    <View style={[styles.card, highlighted ? styles.cardHighlighted : null]}>
      <Pressable
        onPress={handleOpen}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={'Use ' + name + ' in the converter'}
        style={styles.main}>
        <View style={styles.texts}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.vehicle} numberOfLines={1}>
            {vehicle}
          </Text>
          <Text style={styles.caption} numberOfLines={1}>
            {origin === 'reference' ? 'Typical reference' : 'Custom value'}
          </Text>
        </View>
        <View style={styles.valueBox}>
          <Text style={styles.value} numberOfLines={1}>
            {formatTorque(nm, displayUnit, decimals)}
          </Text>
          <Text style={styles.unit} numberOfLines={1}>
            {displayUnit}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={handleDelete}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={'Delete ' + name}
        style={styles.menu}>
        <Trash2 size={20} color={theme.colors.accent.warm} strokeWidth={1.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glass,
    paddingLeft: 14,
    paddingRight: 6,
    ...theme.shadows.card,
  },
  cardHighlighted: {
    borderColor: theme.colors.accent.primary,
    borderWidth: 2,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  vehicle: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  valueBox: {
    alignItems: 'flex-end',
  },
  value: {
    ...theme.typography.value,
    color: theme.colors.accent.secondary,
  },
  unit: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  menu: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(SpecCard);
