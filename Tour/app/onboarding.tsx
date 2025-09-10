import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAppDispatch } from '@/store';
import { signInSuccess } from '@/store/slices/authSlice';

export default function OnboardingScreen() {
  const dispatch = useAppDispatch();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '600' }}>Select Role (dev stub)</Text>
      <Button
        title="Tourist"
        onPress={() => dispatch(signInSuccess({ userId: 'u1', role: 'tourist' }))}
      />
      <Button title="Police" onPress={() => dispatch(signInSuccess({ userId: 'u2', role: 'police' }))} />
      <Button title="Hotel" onPress={() => dispatch(signInSuccess({ userId: 'u3', role: 'hotel' }))} />
      <Button title="Airport" onPress={() => dispatch(signInSuccess({ userId: 'u4', role: 'airport' }))} />
    </View>
  );
}


