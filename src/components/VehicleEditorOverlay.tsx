import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Folder } from 'lucide-react-native';
import theme from '../constants/theme';
import { HIT_SLOP, SCREEN_PAD, TOUCH_MIN } from '../constants/config';
import { PrimaryButton, SecondaryButton } from './Buttons';
import type { Vehicle } from '../game/conversionSession';

const TYPES: Vehicle['type'][] = ['bike', 'car', 'other'];
const TYPE_LABEL: Record<Vehicle['type'], string> = {
  bike: 'Bike',
  car: 'Car',
  other: 'Other',
};

type Props = {
  visible: boolean;
  existingNames: string[];
  onCancel: () => void;
  onSave: (name: string, type: Vehicle['type'], model: string) => void;
};

function VehicleEditorOverlay({ visible, existingNames, onCancel, onSave }: Props) {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<Vehicle['type']>('other');

  useEffect(() => {
    if (visible) {
      setName('');
      setModel('');
      setType('other');
    }
  }, [visible]);

  const trimmed = name.trim();
  const duplicate = existingNames.some(n => n.toLowerCase() === trimmed.toLowerCase());
  const valid = trimmed.length > 0 && trimmed.length <= 40 && !duplicate;

  const handleSave = useCallback(() => {
    if (valid) {
      onSave(trimmed, type, model.trim());
    }
  }, [model, onSave, trimmed, type, valid]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.scrim}>
        <LinearGradient
          colors={theme.gradients.screenAlt as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.panel}>
          <View style={styles.head}>
            <Folder size={24} color={theme.colors.accent.secondary} strokeWidth={1.5} />
            <Text style={styles.title}>Add vehicle</Text>
          </View>

          <Text style={styles.label}>NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Workshop bike"
            placeholderTextColor={theme.colors.text.muted}
            accessibilityLabel="Vehicle name"
            style={styles.input}
            maxLength={40}
          />
          {duplicate ? <Text style={styles.error}>That name already exists</Text> : null}

          <Text style={styles.label}>TYPE</Text>
          <View style={styles.row}>
            {TYPES.map(option => (
              <TypeChip
                key={option}
                type={option}
                selected={option === type}
                onSelect={setType}
              />
            ))}
          </View>

          <Text style={styles.label}>MODEL</Text>
          <TextInput
            value={model}
            onChangeText={setModel}
            placeholder="Optional"
            placeholderTextColor={theme.colors.text.muted}
            accessibilityLabel="Vehicle model"
            style={styles.input}
            maxLength={60}
          />

          <View style={styles.actions}>
            <PrimaryButton label="SAVE VEHICLE" onPress={handleSave} disabled={!valid} />
            <SecondaryButton label="CANCEL" onPress={onCancel} />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

type ChipProps = {
  type: Vehicle['type'];
  selected: boolean;
  onSelect: (type: Vehicle['type']) => void;
};

const TypeChip = React.memo(function TypeChip({ type, selected, onSelect }: ChipProps) {
  const handlePress = useCallback(() => onSelect(type), [onSelect, type]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={TYPE_LABEL[type]}
      style={[styles.chip, selected ? styles.chipSelected : null]}>
      <Text style={[styles.chipLabel, selected ? styles.chipLabelSelected : null]}>
        {TYPE_LABEL[type]}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.ui.scrim,
  },
  panel: {
    paddingHorizontal: SCREEN_PAD,
    paddingTop: 18,
    paddingBottom: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text.primary,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    minHeight: 56,
    paddingHorizontal: 14,
    fontSize: 18,
    lineHeight: 26,
    color: theme.colors.text.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: '#E9EFF00D',
  },
  error: {
    ...theme.typography.caption,
    color: theme.colors.accent.warm,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: '#E9EFF00D',
  },
  chipSelected: {
    backgroundColor: theme.colors.accent.primary,
    borderColor: theme.colors.accent.secondary,
    borderWidth: 2,
  },
  chipLabel: {
    ...theme.typography.buttonSm,
    color: theme.colors.text.secondary,
  },
  chipLabelSelected: {
    color: theme.colors.text.onTeal,
  },
  actions: {
    gap: 10,
    marginTop: 18,
  },
});

export default VehicleEditorOverlay;
