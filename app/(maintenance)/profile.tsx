import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import StatsCard from "@/components/StatsCard";
import ProfileForm from "@/components/ProfileForm";
import ComplaintCard from "@/components/ComplaintCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { getUserFeedbacks } from "@/utils/actions";

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

const Profile = () => {
  const { user } = useAuth();

  const [editedUser, setEditedUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeedbacks();
    setRefreshing(false);
  };

  const loadFeedbacks = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      const data = await getUserFeedbacks(authUser.id);
      setFeedbacks(data || []);
    } catch (error) {
      console.log("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditedUser(user);
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    if (
      !editedUser.name?.trim() ||
      !editedUser.email?.trim() ||
      !editedUser.phone?.trim()
    ) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  // Stats
  const totalReports = feedbacks.length;
  const resolvedReports = feedbacks.filter(
    (f) => f.status === "resolved",
  ).length; // if you later add status column

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]} // Android spinner
          tintColor={colors.primary} // iOS spinner
        />
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <View style={{ padding: 16, marginTop: 16 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            marginTop: 16,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: colors.primary,
            }}
          >
            Profile
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.white,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#FEE2E2",
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
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
                {user?.name?.charAt(0)}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
              color: colors.dark,
            }}
          >
            {user?.name}
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

          <Text style={{ color: colors.dark }}>{user?.email}</Text>
          <Text style={{ color: colors.dark, marginBottom: 16 }}>
            {user?.phone}
          </Text>

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

        {/* Feedback Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text
            style={{ fontSize: 18, fontWeight: "600", color: colors.primary }}
          >
            My Submitted Feedback
          </Text>
          <Text style={{ color: colors.gray }}>{feedbacks.length} total</Text>
        </View>

        {feedbacks.length > 0 ? (
          feedbacks.map((item) => (
            <ComplaintCard
              key={item.id}
              complaint={{
                id: item.id.toString(),
                title: item.issue_type,
                status: "in-progress", // or resolved based on your data
                toiletId: item.toilets?.id?.toString(),
                toiletName: item.toilets?.name,
                date: new Date(item.created_at).toLocaleDateString(),
              }}
            />
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
              No feedback submitted yet
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;
