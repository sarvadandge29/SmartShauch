import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Fonts } from '@/constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// Blue theme colors
const primaryBlue = '#1E3A8A'; // Dark blue
const secondaryBlue = '#2563EB'; // Medium blue
const lightBlue = '#DBEAFE'; // Light blue
const white = '#FFFFFF';
const darkBlue = '#0F172A'; // Very dark blue for text
const grayText = '#64748B';
const lightGray = '#F1F5F9';

// Sample nearby toilets data
const nearbyToilets = [
  {
    id: 1,
    name: 'City Center Mall',
    code: 'TL-001',
    distance: '0.2 km',
    cleanliness: 'Excellent',
    waterLevel: 92,
    waterStatus: 'Optimal',
    address: '123 Main Street, Downtown',
    openTime: '24/7',
    rating: 4.8,
    accessible: true,
  },
  {
    id: 2,
    name: 'Central Park',
    code: 'TL-002',
    distance: '0.5 km',
    cleanliness: 'Good',
    waterLevel: 65,
    waterStatus: 'Moderate',
    address: 'Central Park Avenue',
    openTime: '6:00 AM - 10:00 PM',
    rating: 4.2,
    accessible: true,
  },
  {
    id: 3,
    name: 'Train Station',
    code: 'TL-003',
    distance: '0.8 km',
    cleanliness: 'Needs Attention',
    waterLevel: 15,
    waterStatus: 'Low',
    address: 'Railway Station Road',
    openTime: '24/7',
    rating: 3.5,
    accessible: false,
  },
  {
    id: 4,
    name: 'Public Library',
    code: 'TL-004',
    distance: '1.2 km',
    cleanliness: 'Very Good',
    waterLevel: 78,
    waterStatus: 'Good',
    address: 'Book Street, Downtown',
    openTime: '9:00 AM - 8:00 PM',
    rating: 4.5,
    accessible: true,
  },
  {
    id: 5,
    name: 'Metro Station',
    code: 'TL-005',
    distance: '1.5 km',
    cleanliness: 'Fair',
    waterLevel: 45,
    waterStatus: 'Moderate',
    address: 'Metro Plaza',
    openTime: '5:00 AM - 12:00 AM',
    rating: 3.8,
    accessible: true,
  },
];

// Get cleanliness color
const getCleanlinessColor = (cleanliness: string) => {
  switch (cleanliness) {
    case 'Excellent':
      return '#10B981'; // Green
    case 'Very Good':
      return '#34D399'; // Light green
    case 'Good':
      return '#FBBF24'; // Yellow
    case 'Fair':
      return '#F97316'; // Orange
    case 'Needs Attention':
      return '#EF4444'; // Red
    default:
      return grayText;
  }
};

// Get water level color
const getWaterLevelColor = (level: number) => {
  if (level >= 70) return '#10B981'; // Green
  if (level >= 40) return '#FBBF24'; // Yellow
  return '#EF4444'; // Red
};

export default function Home() {
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
    <View className="flex-1" style={{ backgroundColor: lightGray }}>
      <StatusBar barStyle="dark-content" backgroundColor={lightGray} />
      
      {/* Header */}
      <View className="pt-12 pb-4 px-6" style={{ backgroundColor: primaryBlue }}>
        <Text 
          className="text-2xl font-bold text-white"
          style={{ fontFamily: getFontFamily('serif') }}
        >
          Smart Toilet Finder
        </Text>
        
        {/* Location Section */}
        <View className="flex-row items-center mt-3">
          <Icon name="my-location" size={20} color={lightBlue} />
          <View className="ml-2">
            <Text className="text-xs" style={{ color: lightBlue, fontFamily: getFontFamily('sans') }}>
              Current Location
            </Text>
            <Text className="text-base font-semibold" style={{ color: white, fontFamily: getFontFamily('sans') }}>
              Downtown District
            </Text>
          </View>
        </View>
        
        {/* Stats Row */}
        <View className="flex-row justify-between mt-4 pb-2">
          <View className="flex-row items-center">
            <Icon name="wc" size={18} color={lightBlue} />
            <Text className="ml-1 text-white" style={{ fontFamily: getFontFamily('sans') }}>
              {nearbyToilets.length} toilets near you
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={{ color: lightBlue, fontFamily: getFontFamily('sans') }}>
              View Map
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content - Scrollable List */}
      <ScrollView 
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Nearby Toilets Header */}
        <View className="flex-row justify-between items-center mb-3 px-2">
          <Text 
            className="text-lg font-bold"
            style={{ color: darkBlue, fontFamily: getFontFamily('serif') }}
          >
            Nearby Toilets
          </Text>
          <Text 
            className="text-sm"
            style={{ color: secondaryBlue, fontFamily: getFontFamily('sans') }}
          >
            {nearbyToilets.length} locations
          </Text>
        </View>

        {/* Toilets List */}
        {nearbyToilets.map((toilet) => (
          <TouchableOpacity
            key={toilet.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm"
            style={{ 
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}
            activeOpacity={0.7}
            onPress={() => console.log('View details:', toilet.name)}
          >
            {/* Header with name and code */}
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text 
                  className="text-lg font-bold"
                  style={{ color: primaryBlue, fontFamily: getFontFamily('serif') }}
                >
                  {toilet.name}
                </Text>
                <Text 
                  className="text-xs mt-1"
                  style={{ color: secondaryBlue, fontFamily: getFontFamily('mono') }}
                >
                  {toilet.code}
                </Text>
              </View>
              <View className="bg-blue-50 px-3 py-1 rounded-full" style={{ backgroundColor: lightBlue }}>
                <Text 
                  className="text-xs font-semibold"
                  style={{ color: primaryBlue, fontFamily: getFontFamily('sans') }}
                >
                  {toilet.distance}
                </Text>
              </View>
            </View>

            {/* Cleanliness and Water Level */}
            <View className="flex-row justify-between mt-3">
              <View className="flex-1">
                <Text 
                  className="text-xs mb-1"
                  style={{ color: grayText, fontFamily: getFontFamily('sans') }}
                >
                  Cleanliness
                </Text>
                <Text 
                  className="text-sm font-semibold"
                  style={{ color: getCleanlinessColor(toilet.cleanliness), fontFamily: getFontFamily('sans') }}
                >
                  {toilet.cleanliness}
                </Text>
              </View>
              
              <View className="flex-1">
                <Text 
                  className="text-xs mb-1"
                  style={{ color: grayText, fontFamily: getFontFamily('sans') }}
                >
                  Water Level
                </Text>
                <View className="flex-row items-center">
                  <View className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                    <View 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${toilet.waterLevel}%`,
                        backgroundColor: getWaterLevelColor(toilet.waterLevel)
                      }}
                    />
                  </View>
                  <Text 
                    className="text-sm font-semibold"
                    style={{ color: darkBlue, fontFamily: getFontFamily('sans') }}
                  >
                    {toilet.waterLevel}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Additional Info Row */}
            <View className="flex-row items-center mt-3">
              <Icon name="access-time" size={16} color={grayText} />
              <Text className="text-xs ml-1 mr-3" style={{ color: grayText, fontFamily: getFontFamily('sans') }}>
                {toilet.openTime}
              </Text>
              
              {toilet.accessible && (
                <>
                  <Icon name="accessible" size={16} color={secondaryBlue} />
                  <Text className="text-xs ml-1" style={{ color: secondaryBlue, fontFamily: getFontFamily('sans') }}>
                    Accessible
                  </Text>
                </>
              )}
            </View>

            {/* View Details Link */}
            <View className="flex-row justify-end mt-3 pt-2 border-t" style={{ borderColor: lightGray }}>
              <TouchableOpacity className="flex-row items-center">
                <Text 
                  className="text-sm mr-1"
                  style={{ color: secondaryBlue, fontFamily: getFontFamily('sans') }}
                >
                  View Details
                </Text>
                <Icon name="arrow-forward" size={16} color={secondaryBlue} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>

      {/* Bottom Navigation */}
      <View 
        className="flex-row justify-around items-center py-3 px-6 border-t"
        style={{ backgroundColor: white, borderColor: lightGray }}
      >
      </View>
    </View>
  );
}