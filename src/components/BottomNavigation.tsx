import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bookmark, Calculator, Folder, Hexagon, type LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import { BOTTOM_NAV_H, HIT_SLOP, TOUCH_MIN } from '../constants/config';

export type NavKey = 'convert' | 'specs' | 'reference' | 'vehicles';

type Item = { key: NavKey; label: string; Icon: LucideIcon };

const ITEMS: Item[] = [
  { key: 'convert', label: 'Convert', Icon: Calculator },
  { key: 'specs', label: 'My Specs', Icon: Bookmark },
  { key: 'reference', label: 'Reference', Icon: Hexagon },
  { key: 'vehicles', label: 'Vehicles', Icon: Folder },
];

type TabProps = {
  item: Item;
  selected: boolean;
  onSelect: (key: NavKey) => void;
};

function Tab({ item, selected, onSelect }: TabProps) {
  const { Icon, label, key } = item;
  const handlePress = useCallback(() => onSelect(key), [key, onSelect]);
  const tint = selected ? theme.colors.accent.secondary : theme.colors.text.tertiary;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={styles.tab}>
      <Icon size={24} color={tint} strokeWidth={1.5} />
      <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
        {label}
      </Text>
      {selected ? <View style={styles.marker} /> : null}
    </Pressable>
  );
}

const MemoTab = memo(Tab);

type Props = {
  selected: NavKey | null;
  onSelect: (key: NavKey) => void;
};

function BottomNavigation({ selected, onSelect }: Props) {
  return (
    <View style={styles.root}>
      {ITEMS.map(item => (
        <MemoTab key={item.key} item={item} selected={selected === item.key} onSelect={onSelect} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: BOTTOM_NAV_H,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.ui.overlay,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
  tab: {
    flex: 1,
    minWidth: TOUCH_MIN,
    height: BOTTOM_NAV_H,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    ...theme.typography.caption,
  },
  marker: {
    position: 'absolute',
    bottom: 8,
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.accent.secondary,
  },
});

export default memo(BottomNavigation);
