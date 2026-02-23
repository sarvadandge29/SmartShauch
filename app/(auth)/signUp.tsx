import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
// import Icon from 'react-native-vector-icons/Ionicons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Fonts } from '@/constants/theme';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Blue theme colors
  const primaryBlue = '#1E3A8A'; // Dark blue
  const secondaryBlue = '#2563EB'; // Medium blue
  const lightBlue = '#DBEAFE'; // Light blue
  const white = '#FFFFFF';
  const darkBlue = '#0F172A'; // Very dark blue for text

  const handleSignUp = async () => {
    // Validation
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Phone number validation (basic)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    
    // Simulate API call - replace with your actual registration logic
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success', 
        'Registration successful! Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login')
          }
        ]
      );
    }, 1500);
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
    <ScrollView 
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: primaryBlue }}
    >
      <View className="flex-1 px-6 pt-16 pb-8">
        {/* Header Section */}
        <View className="justify-center items-center mb-8">
          <Text 
            className="text-3xl font-bold"
            style={{ color: white, fontFamily: getFontFamily('serif') }}
          >
            Create Account
          </Text>
          
          <Text 
            className="text-base mt-2 text-center"
            style={{ color: lightBlue, fontFamily: getFontFamily('sans') }}
          >
            Join Smart Toilet Finder to access nearby facilities and report issues
          </Text>
        </View>

        {/* Main Content */}
        <View 
          className="rounded-3xl p-8 shadow-lg"
          style={{ backgroundColor: white }}
        >
          <Text 
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: primaryBlue, fontFamily: getFontFamily('serif') }}
          >
            Sign Up
          </Text>

          {/* Name Input */}
          <View className="mb-4">
            <Text 
              className="text-xs mb-1 font-medium"
              style={{ color: primaryBlue, fontFamily: getFontFamily('sans') }}
            >
              Full Name
            </Text>
            <View className="border rounded-xl p-1" style={{ borderColor: '#CBD5E1' }}>
              <TextInput
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                className="p-3"
                style={{ 
                  color: darkBlue,
                  fontFamily: getFontFamily('sans')
                }}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

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
                placeholder="john@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="p-3"
                style={{ 
                  color: darkBlue,
                  fontFamily: getFontFamily('sans')
                }}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Phone Input */}
          <View className="mb-4">
            <Text 
              className="text-xs mb-1 font-medium"
              style={{ color: primaryBlue, fontFamily: getFontFamily('sans') }}
            >
              Phone Number
            </Text>
            <View className="border rounded-xl p-1" style={{ borderColor: '#CBD5E1' }}>
              <TextInput
                placeholder="9876543210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                className="p-3"
                style={{ 
                  color: darkBlue,
                  fontFamily: getFontFamily('sans')
                }}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-4">
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
                placeholder="Min. 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                className="flex-1 p-3"
                style={{ 
                  color: darkBlue,
                  fontFamily: getFontFamily('sans')
                }}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity 
                onPress={() => setPasswordVisible(!passwordVisible)}
                className="px-3"
              >
                <Text style={{ color: secondaryBlue, fontSize: 12, fontWeight: '600' }}>
                  {passwordVisible ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View className="mb-4">
            <Text 
              className="text-xs mb-1 font-medium"
              style={{ color: primaryBlue, fontFamily: getFontFamily('sans') }}
            >
              Confirm Password
            </Text>
            <View 
              className="border rounded-xl p-1 flex-row items-center justify-between"
              style={{ borderColor: '#CBD5E1' }}
            >
              <TextInput
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!confirmPasswordVisible}
                className="flex-1 p-3"
                style={{ 
                  color: darkBlue,
                  fontFamily: getFontFamily('sans')
                }}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity 
                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                className="px-3"
              >
                <Text style={{ color: secondaryBlue, fontSize: 12, fontWeight: '600' }}>
                  {confirmPasswordVisible ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity 
              className="flex-row items-center flex-1"
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <View 
                className="w-5 h-5 border rounded mr-2 items-center justify-center"
                style={{ 
                  borderColor: secondaryBlue,
                  backgroundColor: agreeTerms ? secondaryBlue : 'transparent'
                }}
              >
                {agreeTerms && (
                  <Text style={{ color: white, fontSize: 12 }}>✓</Text>
                )}
              </View>
              <Text 
                style={{ color: '#475569', fontFamily: getFontFamily('sans'), fontSize: 12 }}
              >
                I agree to the{' '}
                <Text style={{ color: secondaryBlue, fontWeight: '600' }}>
                  Terms
                </Text>
                {' '}and{' '}
                <Text style={{ color: secondaryBlue, fontWeight: '600' }}>
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
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
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/login')} 
            className="mt-2"
            disabled={loading}
          >
            <Text 
              className="text-center"
              style={{ color: '#64748B', fontFamily: getFontFamily('sans') }}
            >
              Already have an account?{' '}
              <Text style={{ color: secondaryBlue, fontWeight: '600' }}>
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-6 items-center">
          <Text 
            className="text-xs"
            style={{ color: lightBlue, fontFamily: getFontFamily('sans') }}
          >
            Secure Registration • End-to-end encrypted
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;