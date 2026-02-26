import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';

import ToiletCard, { ToiletData } from '@/components/ToiletCard';
import ToiletDetailModal from '@/components/ToiletDetailModal';
import { getFontFamily } from '@/utils/fonts';
import { getToiletsData } from '@/utils/actions';

const { width } = Dimensions.get('window');

// Theme colors
const primaryBlue = '#1E3A8A';
const secondaryBlue = '#2563EB';
const lightBlue = '#DBEAFE';
const white = '#FFFFFF';
const darkBlue = '#0F172A';
const grayText = '#64748B';
const lightGray = '#F1F5F9';

// Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Home() {
  const [selectedToilet, setSelectedToilet] = useState<ToiletData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [toilets, setToilets] = useState<any[]>([]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setLoading(true);
    try {
      await fetchToilets();
      await getUserLocation();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchToilets = async () => {
    try {
      const data = await getToiletsData();
      setToilets(data || []);
      console.log('Fetched toilets:', data[0]);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch toilet data');
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setDefaultLocation();
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = currentLocation.coords;

      const addressResponse =
        await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

      const address = addressResponse[0]
        ? `${addressResponse[0].city || 'Pune'}, ${
            addressResponse[0].region || ''
          }`.trim()
        : 'Pune';

      setLocation({
        latitude,
        longitude,
        address: address || 'Pune',
      });
    } catch (error) {
      console.error(error);
      setDefaultLocation();
    }
  };

  const setDefaultLocation = () => {
    setLocation({
      latitude: 18.5204,
      longitude: 73.8567,
      address: 'Pune City Center',
    });
  };

  // Update distances when location changes
  useEffect(() => {
    if (location && toilets.length > 0) {
      updateToiletsWithDistance(
        location.latitude,
        location.longitude
      );
    }
  }, [location]);

  const updateToiletsWithDistance = (
    userLat: number,
    userLon: number
  ) => {
    const updated = toilets.map((toilet) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        toilet.latitude,
        toilet.longitude
      );

      let distanceStr = '';
      if (distance < 1) {
        distanceStr = `${Math.round(distance * 1000)} m`;
      } else {
        distanceStr = `${distance.toFixed(1)} km`;
      }

      return {
        ...toilet,
        distance: distanceStr,
        distanceValue: distance,
      };
    });

    const sorted = updated.sort(
      (a, b) => a.distanceValue - b.distanceValue
    );

    setToilets(sorted);
  };

  const handleRefreshLocation = () => {
    getUserLocation();
  };

  const handleToiletPress = (toilet: ToiletData) => {
    setSelectedToilet(toilet);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedToilet(null);
  };

  if (loading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: lightGray }}
      >
        <ActivityIndicator
          size="large"
          color={primaryBlue}
        />
        <Text
          style={{
            marginTop: 16,
            color: primaryBlue,
            fontFamily: getFontFamily('sans'),
          }}
        >
          Getting your location...
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: lightGray }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={lightGray}
      />

      {/* Header */}
      <View
        className="pt-12 pb-4 px-6"
        style={{ backgroundColor: primaryBlue }}
      >
        <Text
          className="text-2xl font-bold text-white"
          style={{ fontFamily: getFontFamily('serif') }}
        >
          Smart Toilet Finder
        </Text>

        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center flex-1">
            <Icon
              name="my-location"
              size={20}
              color={lightBlue}
            />
            <View className="ml-2 flex-1">
              <Text
                className="text-xs"
                style={{
                  color: lightBlue,
                  fontFamily: getFontFamily('sans'),
                }}
              >
                Current Location
              </Text>
              <Text
                className="text-base font-semibold"
                style={{
                  color: white,
                  fontFamily: getFontFamily('sans'),
                }}
                numberOfLines={1}
              >
                {location?.address || 'Pune'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRefreshLocation}
            className="p-2"
          >
            <Icon
              name="refresh"
              size={20}
              color={lightBlue}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mt-4 pb-2">
          <View className="flex-row items-center">
            <Icon
              name="wc"
              size={18}
              color={lightBlue}
            />
            <Text
              className="ml-1 text-white"
              style={{
                fontFamily: getFontFamily('sans'),
              }}
            >
              {toilets.length} toilets near you
            </Text>
          </View>
        </View>
      </View>

      {/* Toilets List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {toilets.map((toilet) => (
          <ToiletCard
            key={toilet.id}
            toilet={toilet}
            onPress={handleToiletPress}
            onViewDetails={handleToiletPress}
          />
        ))}

        <View className="h-20" />
      </ScrollView>

      <ToiletDetailModal
        visible={modalVisible}
        toilet={selectedToilet}
        onClose={handleCloseModal}
        onGetDirections={() => {}}
      />
    </View>
  );
}