import React, { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Bookmark, CheckCircle, ChevronLeft, Home, RotateCcw } from 'lucide-react-native';
import theme from '../constants/theme';
import { FADE_MS, GAP, HIT_SLOP, SCREEN_PAD } from '../constants/config';
import WorkshopBackground from '../components/WorkshopBackground';
import ScreenHeader from '../components/ScreenHeader';
import { IconButton, PrimaryButton, SecondaryButton } from '../components/Buttons';
import { UNITS, formatTorque, formatRaw, fromNm } from '../game/torqueConversion';
import type { ConversionSnapshot } from '../game/conversionSession';

type RowProps = {
  unit: string;
  value: string;
  hero: boolean;
};

const ResultRow = memo(function ResultRow({ unit, value, hero }: RowProps) {
  return (
    <View style={[styles.card, hero ? styles.cardHero : null]}>
      <Text style={styles.cardUnit}>{unit.toUpperCase()}</Text>
      <Text
        style={[styles.cardValue, hero ? styles.cardValueHero : null]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
});

type Props = {
  snapshot: ConversionSnapshot;
  onSave: () => void;
  onConvertAgain: () => void;
  onViewSpecs: () => void;
  onHome: () => void;
};

function GameOverScreen({ snapshot, onSave, onConvertAgain, onViewSpecs, onHome }: Props) {
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

  const markScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  const canSave = snapshot.nm > 0;
  const context =
    snapshot.origin === 'reference'
      ? 'Typical reference'
      : snapshot.isExample
      ? 'Example input'
      : 'Custom value';

  const ordered = [snapshot.outputUnit].concat(UNITS.filter(u => u !== snapshot.outputUnit));

  return (
    <WorkshopBackground variant="result">
      <ScreenHeader
        title="Conversion ready"
        leftSlot={<IconButton Icon={ChevronLeft} label="Back to the converter" onPress={onConvertAgain} />}
        rightSlot={<IconButton Icon={Home} label="Back to the hub" onPress={onHome} />}
      />

      <Animated.View pointerEvents="box-none" style={[styles.body, { opacity: enter }]}>
        <View style={styles.head}>
          <Animated.View
            pointerEvents="none"
            style={[styles.halo, { transform: [{ scale: markScale }] }]}>
            <CheckCircle size={40} color={theme.colors.accent.secondary} strokeWidth={1.5} />
          </Animated.View>
          <Text style={styles.entered} numberOfLines={1}>
            {formatRaw(fromNm(snapshot.nm, snapshot.inputUnit), snapshot.decimals) +
              ' ' +
              snapshot.inputUnit +
              ' converted'}
          </Text>
          <View style={styles.contextRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{context.toUpperCase()}</Text>
            </View>
            <Text style={styles.precision} numberOfLines={1}>
              {'Display rounded to ' + snapshot.decimals + ' decimals'}
            </Text>
          </View>
        </View>

        <View style={styles.cards}>
          {ordered.map(unit => (
            <ResultRow
              key={unit}
              unit={unit}
              value={formatTorque(snapshot.nm, unit, snapshot.decimals)}
              hero={unit === snapshot.outputUnit}
            />
          ))}
        </View>

        {canSave ? null : (
          <Text style={styles.zeroNote}>Save a value greater than zero.</Text>
        )}
      </Animated.View>

      <View style={styles.actions}>
        <PrimaryButton label="SAVE SPEC" onPress={onSave} Icon={Bookmark} disabled={!canSave} />
        <SecondaryButton label="CONVERT AGAIN" onPress={onConvertAgain} Icon={RotateCcw} />
        <Pressable
          onPress={onViewSpecs}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="View my specs"
          style={styles.textAction}>
          <Text style={styles.textActionLabel}>VIEW MY SPECS</Text>
        </Pressable>
      </View>
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
  head: {
    alignItems: 'center',
    gap: 8,
  },
  halo: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: theme.colors.accent.primary,
    backgroundColor: 'rgba(42, 157, 171, 0.16)',
  },
  entered: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    height: 24,
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: 'rgba(42, 157, 171, 0.18)',
  },
  chipText: {
    ...theme.typography.caption,
    color: theme.colors.accent.secondary,
  },
  precision: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  cards: {
    flex: 1,
    justifyContent: 'center',
    gap: GAP,
    paddingBottom: SCREEN_PAD,
  },
  card: {
    width: '100%',
    minHeight: 88,
    justifyContent: 'center',
    paddingHorizontal: 18,
    gap: 2,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glass,
    ...theme.shadows.card,
  },
  cardHero: {
    borderColor: theme.colors.accent.primary,
    borderWidth: 2,
  },
  cardUnit: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  cardValue: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  cardValueHero: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '800',
    color: theme.colors.accent.secondary,
  },
  zeroNote: {
    ...theme.typography.support,
    color: theme.colors.accent.warm,
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: SCREEN_PAD,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 10,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: '#263B59F2',
  },
  textAction: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textActionLabel: {
    ...theme.typography.buttonSm,
    color: theme.colors.accent.secondary,
  },
});

export default GameOverScreen;
