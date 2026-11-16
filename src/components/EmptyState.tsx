import React, { memo } from 'react';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import theme from '../constants/theme';
import { PrimaryButton } from './Buttons';

type Props = {
  illustration: ImageSourcePropType;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

function EmptyState({ illustration, title, body, actionLabel, onAction }: Props) {
  return (
    <View style={styles.root}>
      <Image source={illustration} style={styles.art} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {actionLabel && onAction ? (
        <View style={styles.actionSlot}>
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 10,
  },
  art: {
    width: 112,
    height: 112,
    opacity: 0.9,
  },
  title: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  body: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  actionSlot: {
    width: '100%',
    maxWidth: 280,
    marginTop: 6,
  },
});

export default memo(EmptyState);
