import React, { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { ChevronLeft, Info, Trash2 } from 'lucide-react-native';
import theme from '../constants/theme';
import { DECIMAL_CHOICES, GAP, HIT_SLOP, SCREEN_PAD } from '../constants/config';
import WorkshopBackground from '../components/WorkshopBackground';
import ScreenHeader from '../components/ScreenHeader';
import SurfaceCard from '../components/SurfaceCard';
import UnitPicker from '../components/UnitPicker';
import { IconButton, SecondaryButton } from '../components/Buttons';
import { UNITS, type Unit } from '../game/torqueConversion';

type RowKey = 'input' | 'output' | 'decimals' | 'toggles' | 'data' | 'about';

const ROWS: RowKey[] = ['input', 'output', 'decimals', 'toggles', 'data', 'about'];

type Props = {
  defaultInput: Unit;
  preferredOutput: Unit;
  decimals: number;
  haptics: boolean;
  reduceMotion: boolean;
  specCount: number;
  vehicleCount: number;
  onChangeInput: (unit: Unit) => void;
  onChangeOutput: (unit: Unit) => void;
  onChangeDecimals: (value: number) => void;
  onToggleHaptics: (value: boolean) => void;
  onToggleMotion: (value: boolean) => void;
  onDeleteData: () => void;
  onOpenAbout: () => void;
  onBack: () => void;
};

function SettingsScreen(props: Props) {
  const {
    defaultInput,
    preferredOutput,
    decimals,
    haptics,
    reduceMotion,
    specCount,
    vehicleCount,
    onChangeInput,
    onChangeOutput,
    onChangeDecimals,
    onToggleHaptics,
    onToggleMotion,
    onDeleteData,
    onOpenAbout,
    onBack,
  } = props;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<RowKey>) => {
      if (item === 'input') {
        return (
          <SurfaceCard>
            <UnitPicker
              label="Default input unit"
              value={defaultInput}
              options={UNITS}
              onChange={onChangeInput}
            />
          </SurfaceCard>
        );
      }
      if (item === 'output') {
        return (
          <SurfaceCard>
            <UnitPicker
              label="Preferred output unit"
              value={preferredOutput}
              options={UNITS}
              onChange={onChangeOutput}
            />
          </SurfaceCard>
        );
      }
      if (item === 'decimals') {
        return (
          <SurfaceCard>
            <Text style={styles.label}>DECIMAL PLACES</Text>
            <View style={styles.choices}>
              {DECIMAL_CHOICES.map(choice => (
                <DecimalChoice
                  key={choice}
                  value={choice}
                  selected={choice === decimals}
                  onSelect={onChangeDecimals}
                />
              ))}
            </View>
          </SurfaceCard>
        );
      }
      if (item === 'toggles') {
        return (
          <SurfaceCard>
            <View style={styles.toggleRow}>
              <View style={styles.toggleTexts}>
                <Text style={styles.toggleTitle}>Haptic feedback</Text>
                <Text style={styles.toggleCaption}>One short pulse after a saved spec</Text>
              </View>
              <Switch
                value={haptics}
                onValueChange={onToggleHaptics}
                accessibilityLabel="Haptic feedback"
                trackColor={{ true: theme.colors.accent.primary, false: theme.colors.bg.tertiary }}
                thumbColor={theme.colors.text.primary}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.toggleRow}>
              <View style={styles.toggleTexts}>
                <Text style={styles.toggleTitle}>Reduce motion</Text>
                <Text style={styles.toggleCaption}>Fades only, no scaling or movement</Text>
              </View>
              <Switch
                value={reduceMotion}
                onValueChange={onToggleMotion}
                accessibilityLabel="Reduce motion"
                trackColor={{ true: theme.colors.accent.primary, false: theme.colors.bg.tertiary }}
                thumbColor={theme.colors.text.primary}
              />
            </View>
          </SurfaceCard>
        );
      }
      if (item === 'data') {
        return (
          <SurfaceCard>
            <Text style={styles.label}>LOCAL DATA</Text>
            <Text style={styles.body}>
              {'Saved on this device: ' +
                specCount +
                ' specs, ' +
                vehicleCount +
                ' vehicle folders.'}
            </Text>
            <View style={styles.action}>
              <SecondaryButton
                label="DELETE ALL SAVED DATA"
                onPress={onDeleteData}
                Icon={Trash2}
                disabled={specCount === 0 && vehicleCount === 0}
              />
            </View>
          </SurfaceCard>
        );
      }
      return (
        <Pressable
          onPress={onOpenAbout}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Open about"
          style={styles.aboutRow}>
          <Info size={24} color={theme.colors.accent.secondary} strokeWidth={1.5} />
          <Text style={styles.aboutLabel}>About this app</Text>
        </Pressable>
      );
    },
    [
      decimals,
      defaultInput,
      haptics,
      onChangeDecimals,
      onChangeInput,
      onChangeOutput,
      onDeleteData,
      onOpenAbout,
      onToggleHaptics,
      onToggleMotion,
      preferredOutput,
      reduceMotion,
      specCount,
      vehicleCount,
    ],
  );

  const keyExtractor = useCallback((item: RowKey) => item, []);

  return (
    <WorkshopBackground variant="alt">
      <ScreenHeader
        title="Settings"
        leftSlot={<IconButton Icon={ChevronLeft} label="Go back" onPress={onBack} />}
      />
      <FlatList
        data={ROWS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      />
    </WorkshopBackground>
  );
}

type ChoiceProps = {
  value: number;
  selected: boolean;
  onSelect: (value: number) => void;
};

const DecimalChoice = React.memo(function DecimalChoice({ value, selected, onSelect }: ChoiceProps) {
  const handlePress = useCallback(() => onSelect(value), [onSelect, value]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={value + ' decimal places'}
      style={[styles.choice, selected ? styles.choiceSelected : null]}>
      <Text style={[styles.choiceLabel, selected ? styles.choiceLabelSelected : null]}>
        {String(value)}
      </Text>
    </Pressable>
  );
});

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  content: {
    padding: SCREEN_PAD,
    paddingBottom: 32,
  },
  separator: {
    height: GAP,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginBottom: 8,
  },
  body: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
  },
  choices: {
    flexDirection: 'row',
    gap: 8,
  },
  choice: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: '#E9EFF00D',
  },
  choiceSelected: {
    backgroundColor: theme.colors.accent.primary,
    borderColor: theme.colors.accent.secondary,
    borderWidth: 2,
  },
  choiceLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  choiceLabelSelected: {
    color: theme.colors.text.onTeal,
  },
  toggleRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleTexts: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  toggleCaption: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.ui.divider,
  },
  action: {
    marginTop: 12,
  },
  aboutRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glass,
  },
  aboutLabel: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
});

export default SettingsScreen;
