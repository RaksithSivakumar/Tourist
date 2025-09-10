import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/store';
import { signInSuccess } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import { MaterialIcons } from '@expo/vector-icons';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [role, setRole] = useState<'tourist' | 'police' | 'hotel' | 'airport'>('tourist');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSignup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const user = await authService.signup({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password, 
        role 
      });
      dispatch(signInSuccess({ userId: user.id, role: user.role, digitalId: user.did }));
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Signup Failed', e?.message ?? 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              autoCapitalize="words"
            />
          </View>
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="Password"
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
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              secureTextEntry={secureTextEntry}
            />
          </View>
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          <View style={styles.roleSection}>
            <Text style={styles.roleTitle}>Select Your Role</Text>
            <View style={styles.roleContainer}>
              {(['tourist', 'police', 'hotel', 'airport'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  style={[
                    styles.roleButton,
                    role === r ? styles.roleButtonActive : styles.roleButtonInactive
                  ]}
                >
                  <Text style={[
                    styles.roleText,
                    role === r ? styles.roleTextActive : styles.roleTextInactive
                  ]}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.signupButton, loading && styles.signupButtonDisabled]} 
            onPress={onSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F7FAFC',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#2D3748',
  },
  inputError: {
    borderColor: '#E53E3E',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginBottom: 12,
  },
  roleSection: {
    marginVertical: 20,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: '48%',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#3182CE',
    borderWidth: 1,
    borderColor: '#3182CE',
  },
  roleButtonInactive: {
    backgroundColor: '#EDF2F7',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  roleTextActive: {
    color: '#fff',
  },
  roleTextInactive: {
    color: '#4A5568',
  },
  signupButton: {
    backgroundColor: '#3182CE',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signupButtonDisabled: {
    backgroundColor: '#BEE3F8',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#718096',
  },
  loginLink: {
    color: '#3182CE',
    fontWeight: '600',
  },
});