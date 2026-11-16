import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Bookmark } from 'lucide-react-native';
import theme from '../constants/theme';
import { HIT_SLOP, SCREEN_PAD, TOUCH_MIN } from '../constants/config';
import { PrimaryButton, SecondaryButton } from './Buttons';
import { formatTorque } from '../game/torqueConversion';
import type { ConversionSnapshot, Vehicle } from '../game/conversionSession';

type Props = {
  visible: boolean;
  snapshot: ConversionSnapshot | null;
  vehicles: Vehicle[];
  onCancel: () => void;
  onSave: (name: string, vehicleId: string | null) => void;
};

/**
 * The editor is a modal: the ScrollView lives inside it and never wraps a
 * whole route.
 */
function SpecEditorOverlay({ visible, snapshot, vehicles, onCancel, onSave }: Props) {
  const [name, setName] = useState('Custom spec');
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  useEffect(() => {
    if (visible && snapshot) {
      setName(snapshot.boltSize ? snapshot.boltSize + ' reference' : 'Custom spec');
      setVehicleId(null);
    }
  }, [snapshot, visible]);

  const handleSave = useCallback(() => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      return;
    }
    onSave(trimmed, vehicleId);
  }, [name, onSave, vehicleId]);

  if (!snapshot) {
    return null;
  }

  const valid = name.trim().length > 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.scrim}>
        <LinearGradient
          colors={theme.gradients.screenAlt as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.panel}>
          <View style={styles.head}>
            <Bookmark size={24} color={theme.colors.accent.secondary} strokeWidth={1.5} />
            <Text style={styles.title}>Save spec</Text>
          </View>

          <ScrollView
            style={styles.form}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>NAME</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              accessibilityLabel="Spec name"
              style={styles.input}
              maxLength={60}
            />

            <Text style={styles.value}>
              {formatTorque(snapshot.nm, snapshot.inputUnit, snapshot.decimals) +
                ' ' +
                snapshot.inputUnit}
            </Text>
            <Text style={styles.caption}>
              {snapshot.origin === 'reference' ? 'Typical reference' : 'Custom value'}
            </Text>

            <Text style={styles.label}>VEHICLE</Text>
            <View style={styles.chips}>
              <VehicleChip
                id={null}
                label="Unassigned"
                selected={vehicleId === null}
                onSelect={setVehicleId}
              />
              {vehicles.map(v => (
                <VehicleChip
                  key={v.id}
                  id={v.id}
                  label={v.name}
                  selected={vehicleId === v.id}
                  onSelect={setVehicleId}
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <PrimaryButton label="SAVE SPEC" onPress={handleSave} disabled={!valid} />
            <SecondaryButton label="CANCEL" onPress={onCancel} />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

type ChipProps = {
  id: string | null;
  label: string;
  selected: boolean;
  onSelect: (id: string | null) => void;
};

const VehicleChip = React.memo(function VehicleChip({ id, label, selected, onSelect }: ChipProps) {
  const handlePress = useCallback(() => onSelect(id), [id, onSelect]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={[styles.chip, selected ? styles.chipSelected : null]}>
      <Text style={[styles.chipLabel, selected ? styles.chipLabelSelected : null]} numberOfLines={1}>
        {label}
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
    maxHeight: '86%',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text.primary,
  },
  form: {
    flexGrow: 0,
  },
  formContent: {
    paddingBottom: 12,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginTop: 12,
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
  value: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: theme.colors.accent.warm,
    marginTop: 14,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minWidth: 96,
    height: TOUCH_MIN,
    paddingHorizontal: 14,
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
    marginTop: 14,
  },
});

export default SpecEditorOverlay;
