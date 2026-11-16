import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import { ArrowLeftRight, Calculator, Home, RotateCcw, Settings } from 'lucide-react-native';
import theme from '../constants/theme';
import { FADE_MS, GAP, SCREEN_PAD } from '../constants/config';
import WorkshopBackground from '../components/WorkshopBackground';
import ScreenHeader from '../components/ScreenHeader';
import BottomNavigation, { type NavKey } from '../components/BottomNavigation';
import SurfaceCard from '../components/SurfaceCard';
import UnitPicker from '../components/UnitPicker';
import Stepper from '../components/Stepper';
import ValueCard from '../components/ValueCard';
import { IconButton, PrimaryButton, SecondaryButton } from '../components/Buttons';
import { UNITS, formatTorque, otherUnits, type Unit } from '../game/torqueConversion';
import type { ConverterDraft } from '../hooks/useConverter';

type Props = {
  draft: ConverterDraft;
  valid: boolean;
  decimals: number;
  onChangeText: (text: string) => void;
  onChangeInputUnit: (unit: Unit) => void;
  onChangeOutputUnit: (unit: Unit) => void;
  onChangeStep: (step: number) => void;
  onSwap: () => void;
  onStepStart: (direction: 1 | -1) => void;
  onStepStop: () => void;
  onReset: () => void;
  onConvert: () => void;
  onHome: () => void;
  onOpenSettings: () => void;
  onNavigate: (key: NavKey) => void;
};

function GameScreen({
  draft,
  valid,
  decimals,
  onChangeText,
  onChangeInputUnit,
  onChangeOutputUnit,
  onChangeStep,
  onSwap,
  onStepStart,
  onStepStop,
  onReset,
  onConvert,
  onHome,
  onOpenSettings,
  onNavigate,
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(enter, {
      toValue: 1,
      duration: FADE_MS,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [enter]);

  const rise = enter.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });

  const outputOptions = useMemo(() => otherUnits(draft.inputUnit), [draft.inputUnit]);
  const secondary = useMemo(
    () => UNITS.filter(u => u !== draft.inputUnit && u !== draft.outputUnit)[0],
    [draft.inputUnit, draft.outputUnit],
  );

  const handleConvert = useCallback(() => {
    if (valid) {
      onConvert();
    }
  }, [onConvert, valid]);

  return (
    <WorkshopBackground variant="game">
      <ScreenHeader
        title="Converter"
        leftSlot={<IconButton Icon={Home} label="Back to the hub" onPress={onHome} />}
        rightSlot={<IconButton Icon={Settings} label="Open settings" onPress={onOpenSettings} />}
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.body, { opacity: enter, transform: [{ translateY: rise }] }]}>
        <SurfaceCard radius={18} padding={14} emphasis>
          <View style={styles.inputHead}>
            <Text style={styles.inputLabel}>Torque value</Text>
            {draft.isExample ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>EXAMPLE INPUT</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.valueRow}>
            <TextInput
              value={draft.text}
              onChangeText={onChangeText}
              keyboardType="decimal-pad"
              accessibilityLabel="Torque value to convert"
              style={styles.valueInput}
              maxLength={12}
              selectTextOnFocus
            />
            <Text style={styles.valueUnit} numberOfLines={1}>
              {draft.inputUnit}
            </Text>
          </View>

          {valid ? null : <Text style={styles.error}>Enter a valid value</Text>}

          <View style={styles.block}>
            <UnitPicker
              label="Input unit"
              value={draft.inputUnit}
              options={UNITS}
              onChange={onChangeInputUnit}
            />
          </View>

          <View style={styles.block}>
            <Stepper
              step={draft.step}
              unit={draft.inputUnit}
              onStart={onStepStart}
              onStop={onStepStop}
              onStepChange={onChangeStep}
            />
          </View>
        </SurfaceCard>

        <View style={styles.outputRow}>
          <View style={styles.outputPicker}>
            <UnitPicker
              label="Preferred output"
              value={draft.outputUnit}
              options={outputOptions}
              onChange={onChangeOutputUnit}
            />
          </View>
          <IconButton
            Icon={ArrowLeftRight}
            label="Swap input and output units"
            onPress={onSwap}
            style={styles.swap}
          />
        </View>

        <View style={styles.previewRow}>
          <ValueCard
            unit={draft.outputUnit}
            value={valid ? formatTorque(draft.nm, draft.outputUnit, decimals) : '--'}
            caption="Preferred output"
            highlighted
            big
          />
          <ValueCard
            unit={secondary}
            value={valid ? formatTorque(draft.nm, secondary, decimals) : '--'}
            caption="Also shown"
          />
        </View>
      </Animated.View>

      <View style={styles.controls}>
        <Text style={styles.hint} numberOfLines={1}>
          Conversions update as you change the value
        </Text>
        <PrimaryButton label="CONVERT" onPress={handleConvert} Icon={Calculator} disabled={!valid} />
        <SecondaryButton label="RESET" onPress={onReset} Icon={RotateCcw} />
      </View>

      <BottomNavigation selected="convert" onSelect={onNavigate} />
    </WorkshopBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: SCREEN_PAD,
    paddingTop: SCREEN_PAD,
    gap: GAP,
  },
  inputHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  inputLabel: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
  },
  badge: {
    paddingHorizontal: 8,
    height: 22,
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(42, 157, 171, 0.22)',
  },
  badgeText: {
    ...theme.typography.caption,
    color: theme.colors.accent.secondary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  valueInput: {
    flex: 1,
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '800',
    color: theme.colors.accent.warm,
    padding: 0,
  },
  valueUnit: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  error: {
    ...theme.typography.caption,
    color: theme.colors.accent.warm,
    marginTop: 2,
  },
  block: {
    marginTop: 10,
  },
  outputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  outputPicker: {
    flex: 1,
  },
  swap: {
    marginBottom: 0,
  },
  previewRow: {
    flex: 1,
    minHeight: 92,
    flexDirection: 'row',
    gap: GAP,
    marginBottom: SCREEN_PAD,
  },
  controls: {
    paddingHorizontal: SCREEN_PAD,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 10,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: '#263B59F2',
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});

export default GameScreen;
