import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, type ListRenderItemInfo } from 'react-native';
import { ArrowDownUp, Home, Plus } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { GAP, SCREEN_PAD } from '../constants/config';
import WorkshopBackground from '../components/WorkshopBackground';
import ScreenHeader from '../components/ScreenHeader';
import BottomNavigation, { type NavKey } from '../components/BottomNavigation';
import SearchField from '../components/SearchField';
import SpecCard from '../components/SpecCard';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { IconButton, PrimaryButton } from '../components/Buttons';
import {
  filterSpecs,
  sortSpecs,
  vehicleLabel,
  type SortMode,
  type Spec,
  type Vehicle,
} from '../game/conversionSession';
import type { Unit } from '../game/torqueConversion';

const SORT_LABEL: Record<SortMode, string> = {
  recent: 'Recently updated',
  name: 'Name',
  torque: 'Torque: low to high',
};

const SORT_ORDER: SortMode[] = ['recent', 'name', 'torque'];

type Props = {
  specs: Spec[];
  vehicles: Vehicle[];
  displayUnit: Unit;
  decimals: number;
  savedId: string | null;
  onUseSpec: (spec: Spec) => void;
  onDeleteSpec: (id: string) => void;
  onAddSpec: () => void;
  onHome: () => void;
  onNavigate: (key: NavKey) => void;
};

function MySpecsScreen({
  specs,
  vehicles,
  displayUnit,
  decimals,
  savedId,
  onUseSpec,
  onDeleteSpec,
  onAddSpec,
  onHome,
  onNavigate,
}: Props) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortMode>('recent');

  const visible = useMemo(
    () => sortSpecs(filterSpecs(specs, query, vehicles), sort),
    [query, sort, specs, vehicles],
  );

  const clearQuery = useCallback(() => setQuery(''), []);

  const cycleSort = useCallback(() => {
    setSort(prev => SORT_ORDER[(SORT_ORDER.indexOf(prev) + 1) % SORT_ORDER.length]);
  }, []);

  const handleOpen = useCallback(
    (id: string) => {
      const found = specs.find(s => s.id === id);
      if (found) {
        onUseSpec(found);
      }
    },
    [onUseSpec, specs],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Spec>) => (
      <SpecCard
        id={item.id}
        name={item.name}
        nm={item.nm}
        vehicle={vehicleLabel(vehicles, item.vehicleId)}
        origin={item.origin}
        displayUnit={displayUnit}
        decimals={decimals}
        highlighted={item.id === savedId}
        onOpen={handleOpen}
        onDelete={onDeleteSpec}
      />
    ),
    [decimals, displayUnit, handleOpen, onDeleteSpec, savedId, vehicles],
  );

  const keyExtractor = useCallback((item: Spec) => item.id, []);

  const showStats = specs.length > 0 && vehicles.length > 0;

  return (
    <WorkshopBackground variant="plain">
      <ScreenHeader
        title="My Specs"
        leftSlot={<IconButton Icon={Home} label="Back to the hub" onPress={onHome} />}
        rightSlot={
          <IconButton Icon={ArrowDownUp} label={'Sort: ' + SORT_LABEL[sort]} onPress={cycleSort} />
        }
      />

      <View style={styles.body}>
        <SearchField
          value={query}
          placeholder="Search specs"
          label="Search saved specs"
          onChange={setQuery}
          onClear={clearQuery}
        />

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel} numberOfLines={1}>
            {'SORTED BY ' + SORT_LABEL[sort].toUpperCase()}
          </Text>
        </View>

        {showStats ? (
          <View style={styles.stats}>
            <View style={styles.statSlot}>
              <StatCard
                value={String(specs.length)}
                label="saved specs"
                valueColor={theme.colors.accent.secondary}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                value={String(vehicles.length)}
                label="vehicles"
                valueColor={theme.colors.accent.warm}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.listWrap}>
          {visible.length > 0 ? (
            <FlatList
              data={visible}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={Separator}
              showsVerticalScrollIndicator={false}
              initialNumToRender={6}
              removeClippedSubviews={false}
            />
          ) : specs.length > 0 ? (
            <EmptyState
              illustration={assets.sprite5}
              title="No matching specs"
              body="Nothing matches that search. Clear it to see every saved value."
              actionLabel="CLEAR FILTERS"
              onAction={clearQuery}
            />
          ) : (
            <EmptyState
              illustration={assets.sprite5}
              title="Keep the torque values you use most"
              body="Convert a value, then save it with your own name, vehicle and notes."
              actionLabel="ADD SPEC"
              onAction={onAddSpec}
            />
          )}
        </View>

        {specs.length > 0 ? (
          <View style={styles.footer}>
            <PrimaryButton label="ADD SPEC" onPress={onAddSpec} Icon={Plus} />
          </View>
        ) : null}
      </View>

      <BottomNavigation selected="specs" onSelect={onNavigate} />
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
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  stats: {
    flexDirection: 'row',
    gap: GAP,
  },
  statSlot: {
    flex: 1,
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
  footer: {
    paddingBottom: 12,
  },
});

export default MySpecsScreen;
