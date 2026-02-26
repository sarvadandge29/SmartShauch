import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface ChatHeaderProps {
  title: string;
}

const ChatHeader = ({ title }: ChatHeaderProps) => {
  const router = useRouter();

  return (
    <View
      style={{
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 14,
        backgroundColor: "#2563EB",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Title + Avatar */}
      <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 12 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#1E40AF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {title?.charAt(0)?.toUpperCase()}
          </Text>
        </View>

        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "600",
            marginLeft: 10,
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

export default ChatHeader;