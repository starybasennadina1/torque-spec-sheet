import React, { memo } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { SCREEN_PAD } from '../constants/config';
import { PrimaryButton, SecondaryButton } from './Buttons';

type Props = {
  visible: boolean;
  title: string;
  impact: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmationDialog({
  visible,
  title,
  impact,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.scrim}>
        <LinearGradient
          colors={theme.gradients.screenAlt as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.panel}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.impact}>{impact}</Text>
          <View style={styles.actions}>
            <SecondaryButton label={cancelLabel} onPress={onCancel} />
            <PrimaryButton label={confirmLabel} onPress={onConfirm} />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SCREEN_PAD,
    backgroundColor: theme.colors.ui.scrim,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text.primary,
  },
  impact: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    marginTop: 8,
  },
  actions: {
    gap: 10,
    marginTop: 20,
  },
});

export default memo(ConfirmationDialog);
