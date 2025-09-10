import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useAppDispatch } from '@/store';
import { signOut } from '@/store/slices/authSlice';
import { useRouter } from 'expo-router';

export default function LogoutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const onLogout = () => {
    dispatch(signOut());
    router.replace('/(auth)/login' as any);
  };
  return (
    <TouchableOpacity onPress={onLogout} accessibilityLabel="Logout">
      <Text style={{ color: '#1976d2', fontWeight: '700' }}>Logout</Text>
    </TouchableOpacity>
  );
}


