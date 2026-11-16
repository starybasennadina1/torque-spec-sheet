import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import { HIT_SLOP } from '../constants/config';
import usePressScale from '../hooks/usePressScale';

type Props = {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  onPress: () => void;
  variant?: 'hero' | 'tile' | 'wide';
  actionLabel?: string;
  count?: number;
  style?: ViewStyle;
};

/** One accessible button per tile - never a press target inside a press target. */
function BentoTile({
  title,
  subtitle,
  Icon,
  onPress,
  variant = 'tile',
  actionLabel,
  count = 0,
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  const isHero = variant === 'hero';
  const tint = isHero ? theme.colors.text.primary : theme.colors.accent.secondary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={actionLabel ? actionLabel : title + '. ' + subtitle}
      style={[styles.pressable, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.animated, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={
            (isHero ? theme.gradients.teal : theme.gradients.surface) as unknown as string[]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}>
          <View style={[styles.body, variant === 'wide' ? styles.bodyWide : null]}>
            <View style={styles.iconFrame}>
              <Icon size={24} color={tint} strokeWidth={1.5} />
            </View>
            <View style={[styles.texts, variant === 'wide' ? styles.textsWide : null]}>
              <Text style={[styles.title, isHero ? styles.titleHero : null]} numberOfLines={2}>
                {title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            </View>
            {count > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{String(count)}</Text>
              </View>
            ) : null}
          </View>
          {actionLabel ? (
            <View style={styles.action}>
              <Text style={styles.actionLabel} numberOfLines={1}>
                {actionLabel}
              </Text>
            </View>
          ) : null}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: theme.radius.xl,
    ...theme.shadows.card,
  },
  animated: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  fill: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
    padding: 14,
    gap: 8,
    justifyContent: 'center',
  },
  iconFrame: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  texts: {
    gap: 2,
  },
  textsWide: {
    flex: 1,
  },
  title: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  titleHero: {
    color: theme.colors.text.primary,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    minWidth: 26,
    height: 22,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.accent.warm,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  action: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: theme.colors.accent.warm,
  },
  actionLabel: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});

export default memo(BentoTile);
