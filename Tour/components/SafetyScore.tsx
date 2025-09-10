import React from 'react';
import { View, Text } from 'react-native';

export default function SafetyScore({ score = 72 }: { score?: number }) {
  return (
    <View style={{ padding: 12, backgroundColor: '#12121210', borderRadius: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>Safety Score</Text>
      <Text style={{ fontSize: 28, fontWeight: '800' }}>{score}</Text>
    </View>
  );
}


