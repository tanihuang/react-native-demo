import React from 'react';
import { View, Text, StyleSheet, Button, Pressable } from 'react-native';

export function Header({ navigation }: any) {
  return (
    <View style={styles.header}>
      <Text style={styles.title} onPress={() => navigation.navigate('index')}>Little Lemon</Text>
    </View> 
  );
}

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'yellow',
    display: 'flex',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});