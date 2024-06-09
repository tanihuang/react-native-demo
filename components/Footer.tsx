import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>All rights reserved by Little Lemon, 2024</Text> 
    </View> 
  );
}

export default Footer;

const styles = StyleSheet.create({
  footer: {
    justifyContent: 'center',
    backgroundColor: 'yellow',
    display: 'flex',
    paddingVertical: 15,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  }
});