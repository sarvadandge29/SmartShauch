import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const Chat = () => {
  const router = useRouter();
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, phone, role")
      .eq("role", "admin");

    if (!error && data) {
      setAdmins(data);
    }

    setLoading(false);
  };

  const openChat = (user: User) => {
    router.push({
      pathname: "/chatRoom", // make sure this matches your file name
      params: {
        memberId: user.id,
        memberName: user.name,
      },
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#107ed1" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <FlatList
        data={admins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openChat(item)}
            style={{
              backgroundColor: "#F9FAFB",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Avatar */}
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 22.5,
                  backgroundColor: "#107ed1",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              {/* Info */}
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 13, color: "#6B7280" }}>
                  {item.email}
                </Text>
                <Text style={{ fontSize: 13, color: "#6B7280" }}>
                  {item.phone}
                </Text>
              </View>

              <Ionicons
                name="chatbubble-ellipses-outline"
                size={22}
                color="#107ed1"
              />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: "#6B7280" }}>
              No admin users found
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Chat;