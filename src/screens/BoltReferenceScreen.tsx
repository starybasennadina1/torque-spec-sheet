import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View, type ListRenderItemInfo } from 'react-native';
import { Home, Info } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { GAP, HIT_SLOP, SCREEN_PAD } from '../constants/config';
import WorkshopBackground from '../components/WorkshopBackground';
import ScreenHeader from '../components/ScreenHeader';
import BottomNavigation, { type NavKey } from '../components/BottomNavigation';
import SearchField from '../components/SearchField';
import UnitPicker from '../components/UnitPicker';
import { IconButton } from '../components/Buttons';
import { BOLT_REFERENCE, REFERENCE_CONDITIONS, searchReference, type BoltReference } from '../game/boltReference';
import { UNITS, formatTorque, type Unit } from '../game/torqueConversion';

type RowProps = {
  item: BoltReference;
  unit: Unit;
  decimals: number;
  onUse: (item: BoltReference) => void;
};

function Row({ item, unit, decimals, onUse }: RowProps) {
  const handlePress = useCallback(() => onUse(item), [item, onUse]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={'Use ' + item.size + ' reference value in the converter'}
      style={styles.row}>
      <View style={styles.rowTexts}>
        <Text style={styles.rowSize}>{item.size}</Text>
        <Text style={styles.rowCaption}>Reference value</Text>
      </View>
      <View style={styles.rowValueBox}>
        <Text style={styles.rowValue} numberOfLines={1}>
          {formatTorque(item.nm, unit, decimals)}
        </Text>
        <Text style={styles.rowUnit}>{unit}</Text>
      </View>
    </Pressable>
  );
}

const MemoRow = React.memo(Row);

type Props = {
  decimals: number;
  displayUnit: Unit;
  onUseReference: (item: BoltReference, unit: Unit) => void;
  onHome: () => void;
  onNavigate: (key: NavKey) => void;
};

function BoltReferenceScreen({ decimals, displayUnit, onUseReference, onHome, onNavigate }: Props) {
  const [query, setQuery] = useState('');
  const [unit, setUnit] = useState<Unit>(displayUnit);

  const rows = useMemo(() => searchReference(query), [query]);
  const clearQuery = useCallback(() => setQuery(''), []);

  const handleUse = useCallback(
    (item: BoltReference) => onUseReference(item, unit),
    [onUseReference, unit],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BoltReference>) => (
      <MemoRow item={item} unit={unit} decimals={decimals} onUse={handleUse} />
    ),
    [decimals, handleUse, unit],
  );

  const keyExtractor = useCallback((item: BoltReference) => item.id, []);

  return (
    <WorkshopBackground variant="alt">
      <ScreenHeader
        title="Bolt Reference"
        leftSlot={<IconButton Icon={Home} label="Back to the hub" onPress={onHome} />}
        rightSlot={<IconButton Icon={Info} label="Reference information" onPress={onHome} />}
      />

      <View style={styles.body}>
        <View style={styles.context}>
          <Image source={assets.sprite1} style={styles.contextArt} resizeMode="contain" />
          <View style={styles.contextHead}>
            <Info size={24} color={theme.colors.accent.secondary} strokeWidth={1.5} />
            <Text style={styles.contextTitle}>Steel class 8.8</Text>
          </View>
          <Text style={styles.contextBody}>
            Typical reference values. Follow the vehicle or component maker's torque specification.
          </Text>
          <Text style={styles.contextCaption}>{REFERENCE_CONDITIONS}</Text>
        </View>

        <SearchField
          value={query}
          placeholder="Search size, e.g. M8"
          label="Search bolt sizes"
          onChange={setQuery}
          onClear={clearQuery}
        />

        <UnitPicker label="Display unit" value={unit} options={UNITS} onChange={setUnit} />

        <View style={styles.listWrap}>
          {rows.length > 0 ? (
            <FlatList
              data={rows}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              ItemSeparatorComponent={Separator}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              initialNumToRender={6}
              removeClippedSubviews={false}
            />
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No sizes match</Text>
              <Text style={styles.emptyBody}>
                {'The bundled table covers ' +
                  BOLT_REFERENCE[0].size +
                  ' to ' +
                  BOLT_REFERENCE[BOLT_REFERENCE.length - 1].size +
                  '.'}
              </Text>
            </View>
          )}
        </View>
      </View>

      <BottomNavigation selected="reference" onSelect={onNavigate} />
    </WorkshopBackground>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: SCREEN_PAD,
    paddingTop: SCREEN_PAD,
    gap: 10,
  },
  context: {
    padding: 14,
    gap: 6,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.accent.primary,
    backgroundColor: 'rgba(42, 157, 171, 0.12)',
    overflow: 'hidden',
  },
  contextArt: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 62,
    height: 62,
    opacity: 0.18,
  },
  contextHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contextTitle: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  contextBody: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  contextCaption: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  listWrap: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
  },
  separator: {
    height: GAP,
  },
  row: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glass,
    ...theme.shadows.card,
  },
  rowTexts: {
    gap: 2,
  },
  rowSize: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  rowCaption: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  rowValueBox: {
    alignItems: 'flex-end',
  },
  rowValue: {
    ...theme.typography.value,
    color: theme.colors.accent.secondary,
  },
  rowUnit: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  empty: {
    paddingTop: 24,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  emptyBody: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default BoltReferenceScreen;
