import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { HEADER_CONTENT_H, HEADER_TOP_PAD, SCREEN_PAD, TOUCH_MIN } from '../constants/config';

type Props = {
  title: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

/**
 * The single header used by every screen. Screens differ only through the
 * slots they pass, so padding and backing can never drift between routes.
 */
function ScreenHeader({ title, leftSlot, rightSlot }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.slot}>{leftSlot ?? null}</View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.slot}>{rightSlot ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: HEADER_TOP_PAD,
    height: HEADER_TOP_PAD + HEADER_CONTENT_H,
    paddingHorizontal: SCREEN_PAD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.ui.overlay,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  slot: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
});

export default memo(ScreenHeader);
