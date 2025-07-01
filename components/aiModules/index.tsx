import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

export default function AiModules(props: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  return (
    <View style={styles.container}>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
