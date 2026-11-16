import React, { memo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import theme from '../constants/theme';
import { HIT_SLOP, TOUCH_MIN } from '../constants/config';

type Props = {
  value: string;
  placeholder: string;
  label: string;
  onChange: (text: string) => void;
  onClear: () => void;
};

function SearchField({ value, placeholder, label, onChange, onClear }: Props) {
  return (
    <View style={styles.root}>
      <Search size={20} color={theme.colors.text.tertiary} strokeWidth={1.5} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.muted}
        accessibilityLabel={label}
        style={styles.input}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={onClear}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={styles.clear}>
          <X size={20} color={theme.colors.text.secondary} strokeWidth={1.5} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 4,
    gap: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glass,
  },
  input: {
    flex: 1,
    fontSize: 18,
    lineHeight: 26,
    color: theme.colors.text.primary,
    padding: 0,
  },
  clear: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(SearchField);
