import React, { useCallback, useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View, type ListRenderItemInfo } from 'react-native';
import { Bike, Car, Home, Plus, Trash2, Wrench } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { GAP, HIT_SLOP, SCREEN_PAD, TOUCH_MIN } from '../constants/config';
import WorkshopBackground from '../components/WorkshopBackground';
import ScreenHeader from '../components/ScreenHeader';
import BottomNavigation, { type NavKey } from '../components/BottomNavigation';
import EmptyState from '../components/EmptyState';
import { IconButton, PrimaryButton } from '../components/Buttons';
import { countSpecsFor, type Spec, type Vehicle } from '../game/conversionSession';

type RowData = {
  id: string | null;
  name: string;
  type: Vehicle['type'];
  model?: string;
  count: number;
};

const TYPE_ICON = { bike: Bike, car: Car, other: Wrench };

type RowProps = {
  row: RowData;
  onOpen: (id: string | null) => void;
  onDelete: (id: string) => void;
};

function VehicleRow({ row, onOpen, onDelete }: RowProps) {
  const Icon = TYPE_ICON[row.type];
  const handleOpen = useCallback(() => onOpen(row.id), [onOpen, row.id]);
  const handleDelete = useCallback(() => {
    if (row.id !== null) {
      onDelete(row.id);
    }
  }, [onDelete, row.id]);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={handleOpen}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={'Open ' + row.name}
        style={styles.cardMain}>
        <View style={styles.iconWrap}>
          <Icon size={24} color={theme.colors.accent.secondary} strokeWidth={1.5} />
        </View>
        <View style={styles.cardTexts}>
          <Text style={styles.cardName} numberOfLines={1}>
            {row.name}
          </Text>
          {row.model ? (
            <Text style={styles.cardModel} numberOfLines={1}>
              {row.model}
            </Text>
          ) : null}
          <Text style={styles.cardCount} numberOfLines={1}>
            {row.count > 0 ? row.count + ' saved specs' : 'No specs yet'}
          </Text>
        </View>
      </Pressable>
      {row.id !== null ? (
        <Pressable
          onPress={handleDelete}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={'Delete folder ' + row.name}
          style={styles.cardMenu}>
          <Trash2 size={20} color={theme.colors.accent.warm} strokeWidth={1.5} />
        </Pressable>
      ) : null}
    </View>
  );
}

const MemoVehicleRow = React.memo(VehicleRow);

type Props = {
  vehicles: Vehicle[];
  specs: Spec[];
  onOpenFolder: (id: string | null) => void;
  onDeleteFolder: (id: string) => void;
  onAddVehicle: () => void;
  onHome: () => void;
  onNavigate: (key: NavKey) => void;
};

function VehicleFoldersScreen({
  vehicles,
  specs,
  onOpenFolder,
  onDeleteFolder,
  onAddVehicle,
  onHome,
  onNavigate,
}: Props) {
  const rows = useMemo<RowData[]>(() => {
    const unassigned: RowData = {
      id: null,
      name: 'Unassigned',
      type: 'other',
      count: countSpecsFor(specs, null),
    };
    const folders = vehicles.map(v => ({
      id: v.id,
      name: v.name,
      type: v.type,
      model: v.model,
      count: countSpecsFor(specs, v.id),
    }));
    return [unassigned].concat(folders);
  }, [specs, vehicles]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<RowData>) => (
      <MemoVehicleRow row={item} onOpen={onOpenFolder} onDelete={onDeleteFolder} />
    ),
    [onDeleteFolder, onOpenFolder],
  );

  const keyExtractor = useCallback((item: RowData) => item.id ?? 'unassigned', []);

  return (
    <WorkshopBackground variant="plain">
      <ScreenHeader
        title="Vehicle Folders"
        leftSlot={<IconButton Icon={Home} label="Back to the hub" onPress={onHome} />}
        rightSlot={<IconButton Icon={Plus} label="Add vehicle" onPress={onAddVehicle} />}
      />

      <View style={styles.body}>
        {vehicles.length > 0 ? (
          <View style={styles.listWrap}>
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
          </View>
        ) : (
          <View style={styles.listWrap}>
            <View style={styles.artRow}>
              <Image source={assets.sprite3} style={styles.art} resizeMode="contain" />
              <Image source={assets.sprite4} style={styles.art} resizeMode="contain" />
            </View>
            <EmptyState
              illustration={assets.sprite5}
              title="Give every vehicle its own sheet"
              body="Folders group your saved specs by bike or car. Unassigned keeps everything else."
            />
          </View>
        )}

        <View style={styles.footer}>
          <PrimaryButton label="ADD VEHICLE" onPress={onAddVehicle} Icon={Plus} />
        </View>
      </View>

      <BottomNavigation selected="vehicles" onSelect={onNavigate} />
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
  listWrap: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
  },
  separator: {
    height: GAP,
  },
  artRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    opacity: 0.85,
  },
  art: {
    width: 104,
    height: 104,
  },
  card: {
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 6,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glass,
    ...theme.shadows.card,
  },
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(42, 157, 171, 0.16)',
  },
  cardTexts: {
    flex: 1,
    gap: 2,
  },
  cardName: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  cardModel: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
  },
  cardCount: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  cardMenu: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingBottom: 12,
  },
});

export default VehicleFoldersScreen;
