import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ComplaintCard from "@/components/ComplaintCard";
import { getAllFeedbacks } from "@/utils/actions";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeedbacks = async () => {
    try {
      const data = await getAllFeedbacks();
      setFeedbacks(data || []);
    } catch (error) {
      console.log("Feedback fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadFeedbacks();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-100">
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text className="mt-3 text-slate-500">
          Loading feedback...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-100"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {feedbacks.length > 0 ? (
        feedbacks.map((item) => (
          <ComplaintCard
            key={item.id}
            complaint={{
              id: item.id.toString(),
              title: item.issue_type,
              status: item.resolved ? "resolved" : "in-progress",
              toiletId: item.toilets?.id?.toString(),
              toiletName: item.toilets?.name || "Unknown Toilet",
              date: new Date(item.created_at).toLocaleDateString(),
            }}
          />
        ))
      ) : (
        <View className="bg-white p-8 rounded-2xl items-center mt-10 shadow-sm">
          <Ionicons
            name="document-text-outline"
            size={48}
            color="#64748B"
          />
          <Text className="text-slate-500 mt-2 text-center">
            No feedback submitted yet
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Feedback;