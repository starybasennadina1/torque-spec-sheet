import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { HIT_SLOP, TOUCH_MIN } from '../constants/config';
import { UNIT_LONG, type Unit } from '../game/torqueConversion';

type SegmentProps = {
  unit: Unit;
  selected: boolean;
  onSelect: (unit: Unit) => void;
};

function Segment({ unit, selected, onSelect }: SegmentProps) {
  const handlePress = useCallback(() => onSelect(unit), [onSelect, unit]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={UNIT_LONG[unit]}
      style={[styles.segment, selected ? styles.segmentSelected : null]}>
      <Text
        style={[styles.segmentLabel, selected ? styles.segmentLabelSelected : null]}
        numberOfLines={1}>
        {unit}
      </Text>
    </Pressable>
  );
}

const MemoSegment = memo(Segment);

type Props = {
  label: string;
  value: Unit;
  options: Unit[];
  onChange: (unit: Unit) => void;
};

function UnitPicker({ label, value, options, onChange }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map(unit => (
          <MemoSegment key={unit} unit={unit} selected={unit === value} onSelect={onChange} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    gap: 6,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: '#E9EFF00D',
  },
  segmentSelected: {
    backgroundColor: theme.colors.accent.primary,
    borderColor: theme.colors.accent.secondary,
    borderWidth: 2,
  },
  segmentLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  segmentLabelSelected: {
    color: theme.colors.text.onTeal,
  },
});

export default memo(UnitPicker);
