import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
};

export default function AuthButton({ label, onPress }: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 5,
    height: 40,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
