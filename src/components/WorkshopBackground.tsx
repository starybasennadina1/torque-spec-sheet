import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

export type BackgroundVariant = 'loader' | 'menu' | 'game' | 'result' | 'plain' | 'alt';

type Props = {
  variant: BackgroundVariant;
  children: React.ReactNode;
};

const OVERLAYS: Record<BackgroundVariant, string[]> = {
  // Loader is deliberately the darkest surface in the product.
  loader: ['#060F11FA', '#0C1A1DF7', '#16303AF2'],
  menu: ['#102022E0', '#263B59B8', '#102022E6'],
  game: ['#102022E8', '#1B3140C4', '#102022EE'],
  result: ['#263B59D8', '#16282FEE', '#102022F2'],
  alt: ['#263B59CC', '#102022EE', '#102022F2'],
  plain: ['#102022EE', '#1B3140D8', '#102022F2'],
};

const DIRECTIONS: Record<BackgroundVariant, { start: { x: number; y: number }; end: { x: number; y: number } }> = {
  loader: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  menu: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  game: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  result: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  alt: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  plain: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
};

/** Fine drafting lines kept well below 6% opacity, purely decorative. */
const DecorLines = memo(function DecorLines({ count }: { count: number }) {
  const rows = [];
  for (let i = 1; i <= count; i += 1) {
    rows.push(<View key={i} style={styles.line} />);
  }
  return (
    <View pointerEvents="none" style={styles.decor}>
      {rows}
    </View>
  );
});

function WorkshopBackground({ variant, children }: Props) {
  const direction = DIRECTIONS[variant];
  return (
    <ImageBackground source={assets.bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient
        colors={OVERLAYS[variant]}
        start={direction.start}
        end={direction.end}
        style={StyleSheet.absoluteFill}
      />
      <DecorLines count={variant === 'loader' ? 5 : 8} />
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  content: {
    flex: 1,
  },
  decor: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-around',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.ui.fine,
  },
});

export default memo(WorkshopBackground);
