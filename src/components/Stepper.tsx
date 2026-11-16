import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import theme from '../constants/theme';
import { HIT_SLOP, STEP_CHOICES } from '../constants/config';

type ButtonProps = {
  direction: 1 | -1;
  label: string;
  onStart: (direction: 1 | -1) => void;
  onStop: () => void;
  disabled?: boolean;
};

function StepButton({ direction, label, onStart, onStop, disabled = false }: ButtonProps) {
  const handleIn = useCallback(() => onStart(direction), [direction, onStart]);
  const Icon = direction === 1 ? Plus : Minus;

  return (
    <Pressable
      onPressIn={handleIn}
      onPressOut={onStop}
      onTouchCancel={onStop}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.stepButton, disabled ? styles.disabled : null]}>
      <Icon size={24} color={theme.colors.text.primary} strokeWidth={1.5} />
    </Pressable>
  );
}

type StepChoiceProps = {
  step: number;
  selected: boolean;
  onSelect: (step: number) => void;
};

function StepChoice({ step, selected, onSelect }: StepChoiceProps) {
  const handlePress = useCallback(() => onSelect(step), [onSelect, step]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={'Step ' + step}
      style={[styles.choice, selected ? styles.choiceSelected : null]}>
      <Text style={[styles.choiceLabel, selected ? styles.choiceLabelSelected : null]}>
        {String(step)}
      </Text>
    </Pressable>
  );
}

const MemoStepButton = memo(StepButton);
const MemoStepChoice = memo(StepChoice);

type Props = {
  step: number;
  unit: string;
  onStart: (direction: 1 | -1) => void;
  onStop: () => void;
  onStepChange: (step: number) => void;
};

function Stepper({ step, unit, onStart, onStop, onStepChange }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <MemoStepButton direction={-1} label="Decrease value" onStart={onStart} onStop={onStop} />
        <View style={styles.stepBox}>
          <Text style={styles.stepCaption} numberOfLines={1}>
            {'STEP IN ' + unit.toUpperCase()}
          </Text>
          <View style={styles.choices}>
            {STEP_CHOICES.map(choice => (
              <MemoStepChoice
                key={choice}
                step={choice}
                selected={choice === step}
                onSelect={onStepChange}
              />
            ))}
          </View>
        </View>
        <MemoStepButton direction={1} label="Increase value" onStart={onStart} onStop={onStop} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: '#E9EFF012',
  },
  disabled: {
    opacity: 0.45,
  },
  stepBox: {
    flex: 1,
    gap: 4,
  },
  stepCaption: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  choices: {
    flexDirection: 'row',
    gap: 6,
  },
  choice: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: '#E9EFF00D',
  },
  choiceSelected: {
    backgroundColor: theme.colors.accent.primary,
    borderColor: theme.colors.accent.secondary,
    borderWidth: 2,
  },
  choiceLabel: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  choiceLabelSelected: {
    color: theme.colors.text.onTeal,
  },
});

export default memo(Stepper);
