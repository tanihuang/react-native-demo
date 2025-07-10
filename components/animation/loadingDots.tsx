import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

interface LoadingDotsProps {
  text?: string;
  color?: string;
  size?: number;
}

export default function LoadingDots({
  text = 'Loading',
  color = '#555',
  size = 16
}: LoadingDotsProps) {
  const [dots, setDots] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev + 1) % 4); // 0→1→2→3→0
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDots('.'.repeat(count));
  }, [count]);

  return (
    <Text style={[styles.text, { color, fontSize: size }]}>
      {text}{dots}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
  
  }
});
