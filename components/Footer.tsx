import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

export function Footer() {
  const user = useSelector((state: any) => state.user);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>All rights reserved by Tani Huang, {new Date().getFullYear()}</Text>
    </View> 
  );
}

export default Footer;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    display: 'flex',
    paddingVertical: 5,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  }
});