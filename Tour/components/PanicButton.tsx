import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useAppDispatch } from '@/store';
import { triggerLevel } from '@/store/slices/emergencySlice';

export default function PanicButton() {
  const dispatch = useAppDispatch();
  return (
    <TouchableOpacity
      accessibilityLabel="Panic Button"
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#d32f2f',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 999,
        elevation: 4,
      }}
      onPress={() => dispatch(triggerLevel(1))}
      onLongPress={() => dispatch(triggerLevel(3))}
    >
      <Text style={{ color: 'white', fontWeight: '700' }}>SOS</Text>
    </TouchableOpacity>
  );
}


