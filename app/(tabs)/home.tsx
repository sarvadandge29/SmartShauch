import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { Fonts } from '@/constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ToiletCard, { ToiletData } from '@/components/ToiletCard';
import ToiletDetailModal from '@/components/ToiletDetailModal';

const { width } = Dimensions.get('window');

// Blue theme colors
const primaryBlue = '#1E3A8A';
const secondaryBlue = '#2563EB';
const lightBlue = '#DBEAFE';
const white = '#FFFFFF';
const darkBlue = '#0F172A';
const grayText = '#64748B';
const lightGray = '#F1F5F9';

// Sample nearby toilets data with coordinates
const nearbyToilets: ToiletData[] = [
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
    latitude: 37.78825,
    longitude: -122.4324,
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
    latitude: 37.78925,
    longitude: -122.4344,
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
    latitude: 37.78725,
    longitude: -122.4304,
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
    latitude: 37.78625,
    longitude: -122.4334,
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
    latitude: 37.78525,
    longitude: -122.4314,
  },
];

export default function Home() {
  const [selectedToilet, setSelectedToilet] = useState<ToiletData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleToiletPress = (toilet: ToiletData) => {
    setSelectedToilet(toilet);
    setModalVisible(true);
  };

  const handleViewDetails = (toilet: ToiletData) => {
    setSelectedToilet(toilet);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedToilet(null);
  };

  const handleGetDirections = (toilet: ToiletData) => {
    console.log('Getting directions to:', toilet.name);
    // The actual directions will open via Linking in the modal component
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

        {/* Toilets List - Using Card Component */}
        {nearbyToilets.map((toilet) => (
          <ToiletCard
            key={toilet.id}
            toilet={toilet}
            onPress={handleToiletPress}
            onViewDetails={handleViewDetails}
          />
        ))}

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>

      {/* Detail Modal */}
      <ToiletDetailModal
        visible={modalVisible}
        toilet={selectedToilet}
        onClose={handleCloseModal}
        onGetDirections={handleGetDirections}
      />
    </View>
  );
}