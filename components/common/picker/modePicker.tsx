import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type Option = {
  key: string;
  label: string;
};

type Props = {
  selectedKey: string;
  options: Option[];
  onSelect: (key: string) => void;
};

export default function WebPicker({ selectedKey, options, onSelect }: Props) {
  const [focused, setFocused] = useState(false);
  const selectedLabel = options.find((o) => o.key === selectedKey)?.label || '請選擇模式';

  return (
    <View style={styles.wrapper}>
      <select
        value={selectedKey}
        onChange={(e) => onSelect(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.select}
      >
        <option value="">請選擇模式</option>
        {options.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>

      <FontAwesome
        name={focused ? 'angle-up' : 'angle-down'}
        size={24}
        style={styles.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgb(84, 92, 143)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  select: {
    width: '100%',
    height: '100%',
    paddingLeft: 16,
    paddingRight: 36,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'transparent',
    border: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
  } as any,
  icon: {
    position: 'absolute',
    right: 12,
    top: 12,
    color: '#fff',
    pointerEvents: 'none',
  },
});
