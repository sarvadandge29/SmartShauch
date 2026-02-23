import React from 'react';
import { Text, View, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Fonts } from '@/constants/theme';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function App() {
  // Blue theme colors
  const primaryBlue = '#1E3A8A'; // Dark blue
  const secondaryBlue = '#2563EB'; // Medium blue
  const lightBlue = '#DBEAFE'; // Light blue
  const white = '#FFFFFF';

  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };

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
      <StatusBar barStyle="light-content" backgroundColor={primaryBlue} />
      
      {/* Top Image Section - 45% of screen */}
      <View style={{ height: height * 0.65 }} className="justify-center items-center">
        {/* Replace with your actual image */}
        <Image 
          source={require('@/assets/images/image.png')} 
          style={{ width: 530, height: 750 }}
          resizeMode="contain"
        />
        
        {/* Time Display - Overlay on image section */}
        <View className="absolute top-12 right-8">
          <Text style={{ color: white, fontSize: 16, fontFamily: getFontFamily('sans') }}>
            1:00 AM
          </Text>
        </View>
      </View>
      
      {/* Bottom White Card Section */}
      <View 
        className="flex-1 rounded-t-[20px] px-8 pt-10 pb-8"
        style={{ backgroundColor: white }}
      >
        {/* Main Title */}
        <Text 
          className="text-4xl font-bold text-center"
          style={{ color: primaryBlue, fontFamily: getFontFamily('serif') }}
        >
          Smart Shauch
        </Text>
      
        
        {/* Description with proper spacing */}
        <View className="mt-8">
          <Text 
            className="text-base text-center leading-6"
            style={{ color: '#6B7280', fontFamily: getFontFamily('sans') }}
          >
            Smart Public Toilet Monitoring,{'\n'}
            for Smart City
          </Text>
        </View>
        
        {/* Get Started Button */}
        <View className="items-center mt-6">
          <TouchableOpacity
            onPress={handleGetStarted}
            className="px-12 py-4 rounded-full shadow-lg"
            style={{ backgroundColor: secondaryBlue }}
            activeOpacity={0.8}
          >
            <Text 
              className="text-white text-lg font-semibold tracking-wide"
              style={{ fontFamily: getFontFamily('rounded') }}
            >
              GET STARTED
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Version Text */}
        <Text 
          className="text-xs text-center mt-8"
          style={{ color: '#9CA3AF', fontFamily: getFontFamily('sans') }}
        >
          Smart City Initiative v2.4
        </Text>
      </View>
    </View>
  );
}