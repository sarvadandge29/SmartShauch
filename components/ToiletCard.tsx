import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Fonts } from "@/constants/theme";

// Blue theme colors
const primaryBlue = "#1E3A8A";
const secondaryBlue = "#2563EB";
const lightBlue = "#DBEAFE";
const white = "#FFFFFF";
const darkBlue = "#0F172A";
const grayText = "#64748B";
const lightGray = "#F1F5F9";

// Types for Toilet data - ADDED COORDINATES
export interface ToiletData {
  id: number;
  name: string;
  code: string;
  distance: string;
  cleanliness: string;
  water_level: number;
  water_status: string;
  address: string;
  open_time: string;
  rating: number;
  accessible: boolean;
  latitude?: number; // Made optional with ?
  longitude?: number; // Made optional with ?
}

interface ToiletCardProps {
  toilet: ToiletData;
  onPress: (toilet: ToiletData) => void;
  onViewDetails: (toilet: ToiletData) => void;
}

// Helper functions
const getCleanlinessColor = (cleanliness: string): string => {
  switch (cleanliness) {
    case "Excellent":
      return "#10B981";
    case "Very Good":
      return "#34D399";
    case "Good":
      return "#FBBF24";
    case "Fair":
      return "#F97316";
    case "Needs Attention":
      return "#EF4444";
    default:
      return grayText;
  }
};

const getWaterLevelColor = (level: number): string => {
  if (level >= 70) return "#10B981";
  if (level >= 40) return "#FBBF24";
  return "#EF4444";
};

// Safely get font family
const getFontFamily = (type: "sans" | "serif" | "rounded" | "mono") => {
  if (Fonts && Fonts[type]) {
    return Fonts[type];
  }
  const fallbacks = {
    sans: "System",
    serif: "Georgia",
    rounded: "System",
    mono: "Courier New",
  };
  return fallbacks[type];
};

const ToiletCard: React.FC<ToiletCardProps> = ({
  toilet,
  onPress,
  onViewDetails,
}) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-4 shadow-sm"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      }}
      activeOpacity={0.7}
      onPress={() => {
        onPress(toilet);
      }}
    >
      {/* Header with name and code */}
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text
            className="text-lg font-bold"
            style={{ color: primaryBlue, fontFamily: getFontFamily("serif") }}
          >
            {toilet.name}
          </Text>
          <Text
            className="text-xs mt-1"
            style={{ color: secondaryBlue, fontFamily: getFontFamily("mono") }}
          >
            {toilet.code}
          </Text>
        </View>
        <View
          className="bg-blue-50 px-3 py-1 rounded-full"
          style={{ backgroundColor: lightBlue }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: primaryBlue, fontFamily: getFontFamily("sans") }}
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
            style={{ color: grayText, fontFamily: getFontFamily("sans") }}
          >
            Cleanliness
          </Text>
          <Text
            className="text-sm font-semibold"
            style={{
              color: getCleanlinessColor(toilet.cleanliness),
              fontFamily: getFontFamily("sans"),
            }}
          >
            {toilet.cleanliness}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            className="text-xs mb-1"
            style={{ color: grayText, fontFamily: getFontFamily("sans") }}
          >
            Water Level
          </Text>
          <View className="flex-row items-center">
            <View className="w-16 h-2 bg-gray-200 rounded-full mr-2">
              <View
                className="h-2 rounded-full"
                style={{
                  width: `${toilet.water_level}%`,
                  backgroundColor: getWaterLevelColor(toilet.water_level),
                }}
              />
            </View>
            <Text
              className="text-sm font-semibold"
              style={{ color: darkBlue, fontFamily: getFontFamily("sans") }}
            >
              {toilet.water_level}%
            </Text>
          </View>
        </View>
      </View>

      {/* Additional Info Row */}
      <View className="flex-row items-center mt-3">
        <Icon name="access-time" size={16} color={grayText} />
        <Text
          className="text-xs ml-1 mr-3"
          style={{ color: grayText, fontFamily: getFontFamily("sans") }}
        >
          {toilet.open_time}
        </Text>

        {toilet.accessible && (
          <>
            <Icon name="accessible" size={16} color={secondaryBlue} />
            <Text
              className="text-xs ml-1"
              style={{
                color: secondaryBlue,
                fontFamily: getFontFamily("sans"),
              }}
            >
              Accessible
            </Text>
          </>
        )}
      </View>

      {/* View Details Link */}
      <View
        className="flex-row justify-end mt-3 pt-2 border-t"
        style={{ borderColor: lightGray }}
      >
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => onViewDetails(toilet)}
        >
          <Text
            className="text-sm mr-1"
            style={{ color: secondaryBlue, fontFamily: getFontFamily("sans") }}
          >
            View Details
          </Text>
          <Icon name="arrow-forward" size={16} color={secondaryBlue} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ToiletCard;
