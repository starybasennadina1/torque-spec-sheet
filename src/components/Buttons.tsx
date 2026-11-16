import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import {
  BTN_ICON_GAP,
  BTN_PRIMARY_H,
  BTN_SECONDARY_H,
  HIT_SLOP,
  ICON_LINE_HEIGHT,
  ICON_SIZE,
  TOUCH_MIN,
} from '../constants/config';
import usePressScale from '../hooks/usePressScale';

type PrimaryProps = {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  disabled?: boolean;
  tone?: 'action' | 'teal';
  style?: ViewStyle;
};

/**
 * Pressable is the PARENT and the Animated.View is its child - the only press
 * pattern that keeps onPress alive in an Android release build.
 */
function PrimaryButtonBase({ label, onPress, Icon, disabled = false, tone = 'action', style }: PrimaryProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(!disabled);
  const colors = tone === 'teal' ? theme.gradients.teal : theme.gradients.action;
  const labelColor = tone === 'teal' ? theme.colors.text.onTeal : theme.colors.text.primary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[styles.primaryPressable, disabled ? styles.disabled : null, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.primaryAnimated, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={colors as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryFill}>
          <View style={styles.row}>
            {Icon ? (
              <View style={styles.iconFrame}>
                <Icon size={ICON_SIZE} color={labelColor} strokeWidth={1.5} />
              </View>
            ) : null}
            <Text style={[theme.typography.button, { color: labelColor }]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

type SecondaryProps = {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  disabled?: boolean;
  style?: ViewStyle;
};

function SecondaryButtonBase({ label, onPress, Icon, disabled = false, style }: SecondaryProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(!disabled);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[styles.secondaryPressable, disabled ? styles.disabled : null, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.secondaryFill, { transform: [{ scale }] }]}>
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconFrame}>
              <Icon size={ICON_SIZE} color={theme.colors.text.primary} strokeWidth={1.5} />
            </View>
          ) : null}
          <Text style={[theme.typography.buttonSm, styles.secondaryLabel]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

type IconProps = {
  Icon: LucideIcon;
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

function IconButtonBase({ Icon, label, onPress, active = false, disabled = false, style }: IconProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(!disabled);
  const tint = active ? theme.colors.accent.secondary : theme.colors.text.secondary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.iconPressable, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.iconInner,
          active ? styles.iconInnerActive : null,
          { transform: [{ scale }] },
        ]}>
        <Icon size={ICON_SIZE} color={tint} strokeWidth={1.5} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryPressable: {
    width: '100%',
    height: BTN_PRIMARY_H,
    borderRadius: theme.radius.lg,
    ...theme.shadows.action,
  },
  primaryAnimated: {
    width: '100%',
    height: BTN_PRIMARY_H,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  primaryFill: {
    width: '100%',
    height: BTN_PRIMARY_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryPressable: {
    width: '100%',
    height: BTN_SECONDARY_H,
  },
  secondaryFill: {
    width: '100%',
    height: BTN_SECONDARY_H,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: '#E9EFF00D',
  },
  secondaryLabel: {
    color: theme.colors.text.primary,
  },
  iconPressable: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: '#E9EFF00D',
  },
  iconInnerActive: {
    borderColor: theme.colors.accent.primary,
    backgroundColor: '#2A9DAB26',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: BTN_ICON_GAP,
  },
  iconFrame: {
    width: ICON_SIZE,
    height: ICON_LINE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
export const SecondaryButton = memo(SecondaryButtonBase);
export const IconButton = memo(IconButtonBase);
