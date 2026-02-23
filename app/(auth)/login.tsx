import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
// import Icon from 'react-native-vector-icons/Ionicons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Fonts } from '@/constants/theme';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Blue theme colors
  const primaryBlue = '#1E3A8A'; // Dark blue
  const secondaryBlue = '#2563EB'; // Medium blue
  const lightBlue = '#DBEAFE'; // Light blue
  const white = '#FFFFFF';
  const darkBlue = '#0F172A'; // Very dark blue for text

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call - replace with your actual authentication logic
    setTimeout(() => {
      setLoading(false);
      // Navigate to tabs on successful login
      router.replace('/(tabs)/home');
    }, 1500);
  };

  const handleGuestAccess = () => {
    // Navigate directly to home as guest
    router.replace('/(tabs)/home');
  };

  // Safely get font family
  const getFontFamily = (type: 'sans' | 'serif' | 'rounded' | 'mono') => {
    if (Fonts && Fonts[type]) {
      return Fonts[type];
    }
    const fallbacks = {
      sans: 'System',
      serif: 'Georgia',
      rounded: 'System',
      mono: 'Courier New',
    };
    return fallbacks[type];
  };

  return (
    <View className="flex-1" style={{ backgroundColor: primaryBlue }}>
      {/* Header Section */}
      <View className="pt-12 pb-8 px-6 mt-16 justify-center items-center">
        <Text 
          className="text-3xl font-bold"
          style={{ color: white, fontFamily: getFontFamily('serif') }}
        >
          Welcome Back!
        </Text>
        
        <Text 
          className="text-base mt-2"
          style={{ color: lightBlue, fontFamily: getFontFamily('sans') }}
        >
          Smart Public Toilet Finder & Feedback
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6">
        <View 
          className="rounded-3xl p-8 shadow-lg"
          style={{ backgroundColor: white }}
        >
          <Text 
            className="text-2xl font-bold mb-2 text-center"
            style={{ color: primaryBlue, fontFamily: getFontFamily('serif') }}
          >
            Login
          </Text>
          
          <Text 
            className="text-sm mb-8 text-center"
            style={{ color: '#64748B', fontFamily: getFontFamily('sans') }}
          >
            Find nearby toilets and report issues
          </Text>

          {/* Email Input */}
          <View className="mb-4">
            <Text 
              className="text-xs mb-1 font-medium"
              style={{ color: primaryBlue, fontFamily: getFontFamily('sans') }}
            >
              Email Address
            </Text>
            <View className="border rounded-xl p-1" style={{ borderColor: '#CBD5E1' }}>
              <TextInput
                placeholder="user@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="p-3"
                style={{ 
                  color: darkBlue,
                  fontFamily: getFontFamily('sans'),
                }}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-2">
            <Text 
              className="text-xs mb-1 font-medium"
              style={{ color: primaryBlue, fontFamily: getFontFamily('sans') }}
            >
              Password
            </Text>
            <View 
              className="border rounded-xl p-1 flex-row items-center justify-between"
              style={{ borderColor: '#CBD5E1' }}
            >
              <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                className="flex-1 p-3"
                style={{ 
                  color: darkBlue,
                  fontFamily: getFontFamily('sans')
                }}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity className="px-3">
                <Text style={{ color: secondaryBlue, fontSize: 12, fontWeight: '600' }}>Forgot?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember me */}
          <View className="flex-row items-center mb-8">
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View 
                className="w-5 h-5 border rounded mr-2 items-center justify-center"
                style={{ 
                  borderColor: secondaryBlue,
                  backgroundColor: rememberMe ? secondaryBlue : 'transparent'
                }}
              >
                {rememberMe && (
                  <Text style={{ color: white, fontSize: 12 }}>✓</Text>
                )}
              </View>
              <Text 
                style={{ color: '#475569', fontFamily: getFontFamily('sans') }}
              >
                Remember me
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="p-4 rounded-xl mb-4"
            style={{ backgroundColor: secondaryBlue }}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={white} />
            ) : (
              <Text 
                className="text-center font-bold text-lg"
                style={{ 
                  color: white, 
                  fontFamily: getFontFamily('rounded') 
                }}
              >
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/signUp')}
            className="mt-2"
          >
            <Text 
              className="text-center"
              style={{ color: '#64748B', fontFamily: getFontFamily('sans') }}
            >
              Don't have an account?{' '}
              <Text style={{ color: secondaryBlue, fontWeight: '600' }}>
                Register
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Guest Access */}
        <View className="mt-8 items-center">
          <TouchableOpacity 
            onPress={handleGuestAccess}
            disabled={loading}
          >
            <Text 
              className="text-center text-sm"
              style={{ color: lightBlue, fontFamily: getFontFamily('sans') }}
            >
              Continue as{' '}
              <Text style={{ color: white, fontWeight: '600', textDecorationLine: 'underline' }}>
                Guest
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-4 items-center">
          <Text 
            className="text-xs"
            style={{ color: lightBlue, fontFamily: getFontFamily('sans') }}
          >
            Version 2.4.0 • Secure Login
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Login;