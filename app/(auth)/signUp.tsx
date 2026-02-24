import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButtton";
import { TextLink } from "@/components/TextLink";
import { Checkbox } from "@/components/CheckBox";
import { FormField } from "@/components/FormField";
import { getFontFamily } from '@/utils/fonts';
import { signUp } from "@/utils/actions";

const Colors = {
  primaryBlue: "#1E3A8A",
  secondaryBlue: "#2563EB",
  lightBlue: "#DBEAFE",
  white: "#FFFFFF",
  darkBlue: "#0F172A",
  border: "#CBD5E1",
  muted: "#64748B",
  mutedFg: "#475569",
  placeholder: "#94A3B8",
};

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignUp = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      return Alert.alert("Error", "Please fill in all fields");
    }

    if (password !== confirmPassword)
      return Alert.alert("Error", "Passwords do not match");

    if (password.length < 6)
      return Alert.alert("Error", "Password must be at least 6 characters");

    if (!/^\d{10}$/.test(phone))
      return Alert.alert("Error", "Please enter a valid 10-digit phone number");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return Alert.alert("Error", "Please enter a valid email address");

    if (!agreeTerms)
      return Alert.alert("Error", "Please agree to the terms and conditions");

    try {
      setLoading(true);

      await signUp(email, password, phone, name);

      Alert.alert(
        "Success",
        "Registration successful! Please login to continue.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }],
      );
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: Colors.primaryBlue, flex: 1 }}
      >
        <View className="flex-1 px-6 pt-16 pb-8">
          {/* Header */}
          <View className="justify-center items-center mb-8">
            <Text
              className="text-3xl font-bold"
              style={{
                color: Colors.white,
                fontFamily: getFontFamily("serif"),
              }}
            >
              Create Account
            </Text>
            <Text
              className="text-base mt-2 text-center"
              style={{
                color: Colors.lightBlue,
                fontFamily: getFontFamily("sans"),
              }}
            >
              Join Smart Toilet Finder to access nearby facilities and report
              issues
            </Text>
          </View>

          {/* Card */}
          <View
            className="rounded-3xl p-8 shadow-lg"
            style={{ backgroundColor: Colors.white }}
          >
            <Text
              className="text-2xl font-bold mb-6 text-center"
              style={{
                color: Colors.primaryBlue,
                fontFamily: getFontFamily("serif"),
              }}
            >
              Sign Up
            </Text>

            <FormField
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
            />
            <FormField
              label="Email Address"
              placeholder="john@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormField
              label="Phone Number"
              placeholder="9876543210"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <FormField
              label="Password"
              placeholder="Min. 6 characters"
              value={password}
              onChangeText={setPassword}
              isPassword
            />
            <FormField
              label="Confirm Password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
            />

            <View className="flex-row items-center mb-6">
              <Checkbox
                checked={agreeTerms}
                onToggle={() => setAgreeTerms((v) => !v)}
              >
                {"I agree to the "}
                <Text
                  style={{ color: Colors.secondaryBlue, fontWeight: "600" }}
                >
                  Terms
                </Text>
                {" and "}
                <Text
                  style={{ color: Colors.secondaryBlue, fontWeight: "600" }}
                >
                  Privacy Policy
                </Text>
              </Checkbox>
            </View>

            <PrimaryButton
              label="Create Account"
              onPress={handleSignUp}
              loading={loading}
            />
            <TextLink
              prefix="Already have an account?"
              label="Sign In"
              onPress={() => router.push("/(auth)/login")}
              disabled={loading}
            />
          </View>

          {/* Footer */}
          <View className="mt-6 items-center">
            <Text
              className="text-xs"
              style={{
                color: Colors.lightBlue,
                fontFamily: getFontFamily("sans"),
              }}
            >
              Secure Registration • End-to-end encrypted
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
