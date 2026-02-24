import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "@/components/StatusBadge";
import ComplaintCard from "@/components/ComplaintCard";
import StatsCard from "@/components/StatsCard";
import ProfileForm from "@/components/ProfileForm";
import { supabase } from "@/lib/supabase";

// Color constants
const colors = {
  primary: "#1E3A8A",
  secondary: "#2563EB",
  lightBlue: "#DBEAFE",
  white: "#FFFFFF",
  dark: "#0F172A",
  gray: "#64748B",
  lightGray: "#F1F5F9",
  background: "#F1F5F9",
};

// Mock user data
const MOCK_USER = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
};

// Mock complaints data
const MOCK_COMPLAINTS = [
  {
    id: "FB-005",
    title: "Bad Smell",
    status: "open" as const,
    toiletId: "TL-002",
    toiletName: "Central Park",
    date: "Feb 21, 2026",
  },
  {
    id: "FB-003",
    title: "Dirty",
    status: "resolved" as const,
    toiletId: "TL-005",
    toiletName: "Shopping District",
    date: "Feb 20, 2026",
  },
  {
    id: "FB-008",
    title: "No Water",
    status: "in-progress" as const,
    toiletId: "TL-001",
    toiletName: "Railway Station",
    date: "Feb 19, 2026",
  },
];

const Profile = () => {
  const [user, setUser] = useState(MOCK_USER);
  const [editedUser, setEditedUser] = useState(MOCK_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [complaints] = useState(MOCK_COMPLAINTS);

  // Calculate stats
  const totalReports = complaints.length;
  const resolvedReports = complaints.filter(
    (c) => c.status === "resolved",
  ).length;

  const handleEditToggle = () => {
    setEditedUser(user);
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    if (
      !editedUser.name.trim() ||
      !editedUser.email.trim() ||
      !editedUser.phone.trim()
    ) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setUser(editedUser);
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => router.replace("/(auth)/login"),
        style: "destructive",
      },
    ]);
    const { error } = await supabase.auth.signOut();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{ fontSize: 24, fontWeight: "bold", color: colors.primary }}
          >
            Profile
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.white,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="close" size={24} color={colors.gray} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View
          style={{
            backgroundColor: colors.white,
            padding: 20,
            borderRadius: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.lightGray,
          }}
        >
          {/* Avatar */}
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.lightBlue,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24, color: colors.primary }}>
                {user.name.charAt(0)}
              </Text>
            </View>
          </View>

          {/* User Info */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
              color: colors.dark,
            }}
          >
            {user.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              textAlign: "center",
              color: colors.gray,
              marginBottom: 12,
            }}
          >
            Citizen User
          </Text>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: colors.dark }}>
              {user.email}
            </Text>
          </View>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: colors.dark }}>
              {user.phone}
            </Text>
          </View>

          {/* Edit Button */}
          <TouchableOpacity
            onPress={handleEditToggle}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.secondary,
            }}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={colors.secondary}
            />
            <Text
              style={{
                marginLeft: 8,
                fontWeight: "600",
                color: colors.secondary,
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Edit Form */}
        {isEditing && (
          <ProfileForm
            user={editedUser}
            setUser={setEditedUser}
            onSave={handleSaveChanges}
            onCancel={handleEditToggle}
          />
        )}

        {/* Stats */}
        <StatsCard total={totalReports} resolved={resolvedReports} />

        {/* Complaints Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{ fontSize: 18, fontWeight: "600", color: colors.primary }}
          >
            My Submitted Complaints
          </Text>
          <Text style={{ color: colors.gray }}>{complaints.length} total</Text>
        </View>

        {/* Complaints List */}
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))
        ) : (
          <View
            style={{
              backgroundColor: colors.white,
              padding: 32,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={48}
              color={colors.gray}
            />
            <Text style={{ color: colors.gray, marginTop: 8 }}>
              No complaints yet
            </Text>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: colors.white,
            padding: 16,
            borderRadius: 12,
            marginTop: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#FEE2E2",
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={{ marginLeft: 8, fontWeight: "600", color: "#DC2626" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;
