import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://placehold.co/100x100/3182CE/FFFFFF/png?text=TS' }} 
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>
        </View>

        <View style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
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

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
            onPress={onLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialLoginContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image 
                source={{ uri: 'https://placehold.co/24x24/white/white/png?text=G' }}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
              <Image 
                source={{ uri: 'https://placehold.co/24x24/white/white/png?text=F' }}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
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
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    padding: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3182CE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 60,
    height: 60,
    tintColor: 'white',
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
    marginBottom: 16,
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
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#FED7D7',
    padding: 10,
    borderRadius: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#3182CE',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#3182CE',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonDisabled: {
    backgroundColor: '#BEE3F8',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#718096',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D3748',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  facebookButton: {
    backgroundColor: '#3182CE',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#718096',
  },
  signupLink: {
    color: '#3182CE',
    fontWeight: '600',
  },
});