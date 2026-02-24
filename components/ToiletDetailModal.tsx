import { View, Text, Modal, TouchableOpacity, Dimensions, Linking, Platform } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Fonts } from '@/constants/theme';
import { ToiletData } from './ToiletCard';

const { width, height } = Dimensions.get('window');

// Blue theme colors
const primaryBlue = '#1E3A8A';
const secondaryBlue = '#2563EB';
const lightBlue = '#DBEAFE';
const white = '#FFFFFF';
const darkBlue = '#0F172A';
const grayText = '#64748B';
const lightGray = '#F1F5F9';

interface ToiletDetailModalProps {
  visible: boolean;
  toilet: ToiletData | null;
  onClose: () => void;
  onGetDirections?: (toilet: ToiletData) => void;
}

// Helper functions
const getCleanlinessColor = (cleanliness: string): string => {
  switch (cleanliness) {
    case 'Excellent':
      return '#10B981';
    case 'Very Good':
      return '#34D399';
    case 'Good':
      return '#FBBF24';
    case 'Fair':
      return '#F97316';
    case 'Needs Attention':
      return '#EF4444';
    default:
      return grayText;
  }
};

const getWaterLevelColor = (level: number): string => {
  if (level >= 70) return '#10B981';
  if (level >= 40) return '#FBBF24';
  return '#EF4444';
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

const ToiletDetailModal: React.FC<ToiletDetailModalProps> = ({ 
  visible, 
  toilet, 
  onClose,
  onGetDirections 
}) => {
  if (!toilet) return null;

  // Default coordinates for San Francisco (if no coordinates provided)
  const defaultLatitude = 37.7749;
  const defaultLongitude = -122.4194;
  
  // Use provided coordinates or fallback to default
  const latitude = toilet.latitude || defaultLatitude;
  const longitude = toilet.longitude || defaultLongitude;

  const handleGetDirections = () => {
    // Open Google Maps or Apple Maps with directions
    const scheme = Platform.select({ 
      ios: 'maps:0,0?q=', 
      android: 'geo:0,0?q=' 
    });
    
    const latLng = `${latitude},${longitude}`;
    const label = toilet.name;
    
    let url = '';
    if (Platform.OS === 'ios') {
      url = `maps:${latLng}?q=${label}`;
    } else {
      url = `geo:${latLng}?q=${latLng}(${label})`;
    }
    
    Linking.openURL(url).catch(() => {
      // Fallback to Google Maps web URL
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
    });
    
    if (onGetDirections) {
      onGetDirections(toilet);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ 
          backgroundColor: white, 
          borderTopLeftRadius: 24, 
          borderTopRightRadius: 24,
          maxHeight: height * 0.9,
        }}>
          
          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: lightGray,
          }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: primaryBlue,
              fontFamily: getFontFamily('serif'),
              flex: 1,
            }}>
              Toilet Details
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <Icon name="close" size={24} color={grayText} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <View style={{ maxHeight: height * 0.7 }}>
            {/* Map View - Only show if we have coordinates or use default */}
            <View style={{ height: 200, width: '100%' }}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                initialRegion={{
                  latitude,
                  longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{ latitude, longitude }}
                  title={toilet.name}
                  description={toilet.address}
                >
                  <View style={{ 
                    backgroundColor: primaryBlue, 
                    padding: 8, 
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: white,
                  }}>
                    <Icon name="wc" size={16} color={white} />
                  </View>
                </Marker>
              </MapView>
            </View>

            {/* Details Card */}
            <View style={{ padding: 16 }}>
              {/* Name and Code */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: primaryBlue, fontFamily: getFontFamily('serif') }}>
                    {toilet.name}
                  </Text>
                  <Text style={{ fontSize: 14, color: secondaryBlue, fontFamily: getFontFamily('mono'), marginTop: 2 }}>
                    {toilet.code}
                  </Text>
                </View>
                <View style={{ backgroundColor: lightBlue, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                  <Text style={{ color: primaryBlue, fontWeight: '600', fontFamily: getFontFamily('sans') }}>
                    {toilet.distance}
                  </Text>
                </View>
              </View>

              {/* Address */}
              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <Icon name="location-on" size={20} color={grayText} />
                <Text style={{ marginLeft: 8, flex: 1, color: darkBlue, fontFamily: getFontFamily('sans') }}>
                  {toilet.address}
                </Text>
              </View>

              {/* Cleanliness and Water Level */}
              <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                <View style={{ flex: 1, backgroundColor: lightGray, padding: 12, borderRadius: 12, marginRight: 8 }}>
                  <Text style={{ fontSize: 12, color: grayText, marginBottom: 4, fontFamily: getFontFamily('sans') }}>
                    Cleanliness
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: getCleanlinessColor(toilet.cleanliness), fontFamily: getFontFamily('sans') }}>
                    {toilet.cleanliness}
                  </Text>
                </View>
                
                <View style={{ flex: 1, backgroundColor: lightGray, padding: 12, borderRadius: 12, marginLeft: 8 }}>
                  <Text style={{ fontSize: 12, color: grayText, marginBottom: 4, fontFamily: getFontFamily('sans') }}>
                    Water Level
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginRight: 8 }}>
                      <View style={{ 
                        height: 8, 
                        borderRadius: 4,
                        width: `${toilet.waterLevel}%`,
                        backgroundColor: getWaterLevelColor(toilet.waterLevel)
                      }} />
                    </View>
                    <Text style={{ fontWeight: '600', color: darkBlue, fontFamily: getFontFamily('sans') }}>
                      {toilet.waterLevel}%
                    </Text>
                  </View>
                </View>
              </View>

              {/* Status and Rating Row */}
              <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Icon name="access-time" size={20} color={grayText} />
                  <Text style={{ marginLeft: 8, color: darkBlue, fontFamily: getFontFamily('sans') }}>
                    {toilet.openTime}
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="star" size={20} color="#FBBF24" />
                  <Text style={{ marginLeft: 4, fontWeight: '600', color: darkBlue, fontFamily: getFontFamily('sans') }}>
                    {toilet.rating.toFixed(1)}
                  </Text>
                </View>
              </View>

              {/* Accessibility */}
              {toilet.accessible && (
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  backgroundColor: lightBlue,
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 16,
                }}>
                  <Icon name="accessible" size={24} color={secondaryBlue} />
                  <Text style={{ marginLeft: 8, color: primaryBlue, fontWeight: '500', fontFamily: getFontFamily('sans') }}>
                    Wheelchair Accessible
                  </Text>
                </View>
              )}

              {/* Additional Info */}
              <View style={{ 
                backgroundColor: lightGray,
                padding: 12,
                borderRadius: 12,
                marginBottom: 16,
              }}>
                <Text style={{ fontSize: 14, color: darkBlue, fontFamily: getFontFamily('sans'), lineHeight: 20 }}>
                  Water Status: <Text style={{ fontWeight: '600' }}>{toilet.waterStatus}</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ 
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: lightGray,
            flexDirection: 'row',
          }}>
            <TouchableOpacity
              onPress={handleGetDirections}
              style={{
                flex: 1,
                backgroundColor: secondaryBlue,
                paddingVertical: 14,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              <Icon name="directions" size={20} color={white} />
              <Text style={{ color: white, fontWeight: '600', marginLeft: 8, fontFamily: getFontFamily('sans') }}>
                Get Directions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 0.4,
                backgroundColor: lightGray,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                marginLeft: 8,
              }}
            >
              <Text style={{ color: grayText, fontWeight: '600', fontFamily: getFontFamily('sans') }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ToiletDetailModal;