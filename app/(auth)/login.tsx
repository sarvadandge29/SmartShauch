import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButtton";
import { TextLink } from "@/components/TextLink";
import { login } from "@/utils/actions";
import { getFontFamily } from "@/utils/fonts";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const Colors = {
  primaryBlue: "#1E3A8A",
  secondaryBlue: "#2563EB",
  lightBlue: "#DBEAFE",
  white: "#FFFFFF",
  darkBlue: "#0F172A",
  muted: "#64748B",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert("Error", "Please fill in all fields");
    }

    try {
      setLoading(true);

      const { user, profile } = await login(email, password);

      if (user.role === "user") {
        router.replace("/(tabs)/home");
      } else if (user.role === "admin") {
        router.replace("/(admin)/dashboard" as any);
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.primaryBlue }}>
      {/* Header */}
      <View className="pt-12 pb-8 px-6 mt-16 justify-center items-center">
        <Text
          className="text-3xl font-bold"
          style={{ color: Colors.white, fontFamily: getFontFamily("serif") }}
        >
          Welcome Back!
        </Text>
        <Text
          className="text-base mt-2"
          style={{ color: Colors.lightBlue, fontFamily: getFontFamily("sans") }}
        >
          Smart Public Toilet Finder & Feedback
        </Text>
      </View>

      {/* Card */}
      <View className="flex-1 px-6">
        <View
          className="rounded-3xl p-8 shadow-lg"
          style={{ backgroundColor: Colors.white }}
        >
          <Text
            className="text-2xl font-bold mb-2 text-center"
            style={{
              color: Colors.primaryBlue,
              fontFamily: getFontFamily("serif"),
            }}
          >
            Login
          </Text>
          <Text
            className="text-sm mb-8 text-center"
            style={{ color: Colors.muted, fontFamily: getFontFamily("sans") }}
          >
            Find nearby toilets and report issues
          </Text>

          <FormField
            label="Email Address"
            placeholder="user@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <PrimaryButton
            label="Sign In"
            onPress={handleLogin}
            loading={loading}
          />

          <TextLink
            prefix="Don't have an account?"
            label="Register"
            onPress={() => router.push("/(auth)/signUp")}
            disabled={loading}
          />
        </View>

        {/* Footer */}
        <View className="mt-4 items-center">
          <Text
            className="text-xs"
            style={{
              color: Colors.lightBlue,
              fontFamily: getFontFamily("sans"),
            }}
          >
            Version 2.4.0 • Secure Login
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Login;
