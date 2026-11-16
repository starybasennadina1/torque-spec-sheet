import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Bookmark, Folder, Hexagon, Settings, Wrench } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import {
  APP_NAME,
  BENTO_COL_W,
  BENTO_H,
  BENTO_SMALL_H,
  FADE_MS,
  GAP,
  SCREEN_PAD,
} from '../constants/config';
import WorkshopBackground from '../components/WorkshopBackground';
import ScreenHeader from '../components/ScreenHeader';
import BottomNavigation, { type NavKey } from '../components/BottomNavigation';
import BentoTile from '../components/BentoTile';
import { IconButton } from '../components/Buttons';
import { formatTorque, type Unit } from '../game/torqueConversion';

type Props = {
  specCount: number;
  vehicleCount: number;
  recentName: string | null;
  recentNm: number;
  displayUnit: Unit;
  decimals: number;
  onStartConverting: () => void;
  onOpenSpecs: () => void;
  onOpenVehicles: () => void;
  onOpenReference: () => void;
  onOpenSettings: () => void;
  onNavigate: (key: NavKey) => void;
};

function MenuScreen({
  specCount,
  vehicleCount,
  recentName,
  recentNm,
  displayUnit,
  decimals,
  onStartConverting,
  onOpenSpecs,
  onOpenVehicles,
  onOpenReference,
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

  const rise = enter.interpolate({ inputRange: [0, 1], outputRange: [6, 0] });

  return (
    <WorkshopBackground variant="menu">
      <ScreenHeader
        title={APP_NAME}
        rightSlot={
          <IconButton Icon={Settings} label="Open settings" onPress={onOpenSettings} />
        }
      />

      <View style={styles.body}>
        <View style={styles.hero}>
          <View style={styles.heroTexts}>
            <Text style={styles.heroTitle}>Torque.</Text>
            <Text style={styles.heroSub}>Your values, ready for the workshop.</Text>
          </View>
          <Image source={assets.sprite1} style={styles.heroArt} resizeMode="contain" />
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.grid, { opacity: enter, transform: [{ translateY: rise }] }]}>
          <BentoTile
            variant="hero"
            title="Converter"
            subtitle="Nm · lb-ft · kgf-m"
            Icon={Wrench}
            actionLabel="START CONVERTING"
            onPress={onStartConverting}
            style={styles.heroTile}
          />
          <View style={styles.column}>
            <BentoTile
              title="My Specs"
              subtitle={specCount > 0 ? 'Saved values' : 'Save your first value'}
              Icon={Bookmark}
              count={specCount}
              onPress={onOpenSpecs}
              style={styles.smallTile}
            />
            <BentoTile
              title="Vehicles"
              subtitle={vehicleCount > 0 ? 'Bikes and cars' : 'Add a vehicle'}
              Icon={Folder}
              count={vehicleCount}
              onPress={onOpenVehicles}
              style={styles.smallTile}
            />
          </View>
        </Animated.View>

        <Animated.View pointerEvents="box-none" style={{ opacity: enter }}>
          <BentoTile
            variant="wide"
            title="Bolt Reference"
            subtitle="Values with their assumptions"
            Icon={Hexagon}
            onPress={onOpenReference}
            style={styles.wideTile}
          />
        </Animated.View>

        {recentName ? (
          <View style={styles.recent}>
            <View style={styles.recentTexts}>
              <Text style={styles.recentLabel}>LAST SAVED</Text>
              <Text style={styles.recentName} numberOfLines={1}>
                {recentName}
              </Text>
            </View>
            <Text style={styles.recentValue} numberOfLines={1}>
              {formatTorque(recentNm, displayUnit, decimals) + ' ' + displayUnit}
            </Text>
          </View>
        ) : (
          <View style={styles.recent}>
            <Text style={styles.guide} numberOfLines={2}>
              Convert a value, then save it to a vehicle.
            </Text>
          </View>
        )}
      </View>

      <BottomNavigation selected={null} onSelect={onNavigate} />
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
  hero: {
    flex: 1,
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroTexts: {
    flex: 1,
  },
  heroArt: {
    width: 76,
    height: 76,
    opacity: 0.5,
  },
  heroTitle: {
    ...theme.typography.hero,
    color: theme.colors.text.primary,
  },
  heroSub: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    gap: GAP,
    height: BENTO_H,
  },
  heroTile: {
    width: BENTO_COL_W,
    height: BENTO_H,
  },
  column: {
    flex: 1,
    gap: GAP,
  },
  smallTile: {
    width: '100%',
    height: BENTO_SMALL_H,
  },
  wideTile: {
    width: '100%',
    height: 76,
  },
  recent: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glass,
  },
  recentTexts: {
    flex: 1,
    gap: 2,
  },
  recentLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  recentName: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  recentValue: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: theme.colors.accent.secondary,
  },
  guide: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
  },
});

export default MenuScreen;
