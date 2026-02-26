import React, { useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Fonts } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getFontFamily } from "@/utils/fonts";

const { height } = Dimensions.get("window");

export default function App() {
  const { session, loading, user } = useAuth();

  const primaryBlue = "#1E3A8A";
  const secondaryBlue = "#2563EB";
  const white = "#FFFFFF";

  // Auto redirect if already logged in
  useEffect(() => {
    if (!loading && session) {
      if (user?.role === "admin") {
        router.replace("/(admin)/dashboard");
      }
      if (user?.role === "user") {
        router.replace("/(tabs)/home");
      }
    }
  }, [session, loading]);

  const handleGetStarted = () => {
    if (!session) {
      router.push("/(auth)/login");
      return;
    }
  };

  // Optional: show loader while checking session
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: primaryBlue,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar barStyle="light-content" backgroundColor={primaryBlue} />
        <ActivityIndicator size="large" color={white} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: primaryBlue }}>
      {/* Top Image Section */}
      <View
        style={{ height: height * 0.65 }}
        className="justify-center items-center"
      >
        <Image
          source={require("@/assets/images/image.png")}
          style={{ width: 530, height: 750 }}
          resizeMode="contain"
        />

        <View className="absolute top-12 right-8">
          <Text
            style={{
              color: white,
              fontSize: 16,
              fontFamily: getFontFamily("sans"),
            }}
          >
            1:00 AM
          </Text>
        </View>
      </View>

      {/* Bottom Card */}
      <View
        className="flex-1 rounded-t-[20px] px-8 pt-10 pb-8"
        style={{ backgroundColor: white }}
      >
        <Text
          className="text-4xl font-bold text-center"
          style={{
            color: primaryBlue,
            fontFamily: getFontFamily("serif"),
          }}
        >
          Smart Shauch
        </Text>

        <View className="mt-8">
          <Text
            className="text-base text-center leading-6"
            style={{
              color: "#6B7280",
              fontFamily: getFontFamily("sans"),
            }}
          >
            Smart Public Toilet Monitoring{"\n"}
            for Smart City
          </Text>
        </View>

        <View className="items-center mt-6">
          <TouchableOpacity
            onPress={handleGetStarted}
            className="px-12 py-4 rounded-full shadow-lg"
            style={{ backgroundColor: secondaryBlue }}
            activeOpacity={0.8}
          >
            <Text
              className="text-white text-lg font-semibold tracking-wide"
              style={{ fontFamily: getFontFamily("rounded") }}
            >
              GET STARTED
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          className="text-xs text-center mt-8"
          style={{
            color: "#9CA3AF",
            fontFamily: getFontFamily("sans"),
          }}
        >
          Smart City Initiative v2.4
        </Text>
      </View>
    </View>
  );
}
