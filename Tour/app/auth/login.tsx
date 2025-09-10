import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAppDispatch } from '@/store';
import { signInSuccess } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    setError(undefined);
    return true;
  };

  const onLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const user = await authService.login(formData.email, formData.password);
      dispatch(signInSuccess({ userId: user.id, role: user.role, digitalId: user.did }));
      router.replace('/');
    } catch (e: any) {
      setError(e?.message ?? 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (error) setError(undefined);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{flexGrow: 1}} className="px-5 justify-center">
        <View className="items-center mb-10">
          <View className="w-24 h-24 rounded-full bg-blue-600 justify-center items-center mb-5 shadow-md shadow-black/10 elevation-3">
            <Image 
              source={{ uri: 'https://placehold.co/100x100/3182CE/FFFFFF/png?text=TS' }} 
              className="w-14 h-14 tint-color-white"
            />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</Text>
          <Text className="text-base text-gray-500">Sign in to continue your journey</Text>
        </View>

        <View className="w-full">
          {error ? (
            <Text className="text-red-600 text-sm mb-4 text-center bg-red-100 py-2 px-3 rounded-lg">
              {error}
            </Text>
          ) : null}
          
          <View className="flex-row items-center border border-gray-300 rounded-lg mb-4 px-3 bg-gray-50">
            <MaterialIcons name="email" size={20} color="#666" className="mr-2" />
            <TextInput
              className="flex-1 h-12 text-gray-800"
              placeholder="Email Address"
              placeholderTextColor="#666"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="flex-row items-center border border-gray-300 rounded-lg mb-4 px-3 bg-gray-50">
            <MaterialIcons name="lock" size={20} color="#666" className="mr-2" />
            <TextInput
              className="flex-1 h-12 text-gray-800"
              placeholder="Password"
              placeholderTextColor="#666"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry={secureTextEntry}
            />
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <MaterialIcons 
                name={secureTextEntry ? "visibility" : "visibility-off"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="self-end mb-6">
            <Text className="text-blue-600 text-sm">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className={`h-12 rounded-lg justify-center items-center mb-6 shadow-md shadow-black/10 elevation-2 ${
              loading ? 'bg-blue-300' : 'bg-blue-600'
            }`}
            onPress={onLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">Sign In</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="text-gray-500 px-2 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <View className="flex-row justify-between mb-8">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-gray-800 py-3 px-4 rounded-lg mx-1">
              <Image 
                source={{ uri: 'https://placehold.co/24x24/white/white/png?text=G' }}
                className="w-6 h-6 mr-2"
              />
              <Text className="text-white font-medium">Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-blue-600 py-3 px-4 rounded-lg mx-1">
              <Image 
                source={{ uri: 'https://placehold.co/24x24/white/white/png?text=F' }}
                className="w-6 h-6 mr-2"
              />
              <Text className="text-white font-medium">Facebook</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center">
            <Text className="text-gray-500">Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}