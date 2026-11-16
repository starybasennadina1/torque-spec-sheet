import React, { memo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';

type Props = {
  children: React.ReactNode;
  radius?: 14 | 16 | 18;
  padding?: number;
  emphasis?: boolean;
  style?: ViewStyle;
};

/** background -> card -> control depth, shared by every surface in the app. */
function SurfaceCard({ children, radius = 16, padding = 16, emphasis = false, style }: Props) {
  return (
    <LinearGradient
      colors={theme.gradients.surface as unknown as string[]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.card,
        { borderRadius: radius, padding },
        emphasis ? styles.emphasis : null,
        style,
      ]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    ...theme.shadows.card,
  },
  emphasis: {
    borderColor: theme.colors.accent.primary,
  },
});

export default memo(SurfaceCard);
