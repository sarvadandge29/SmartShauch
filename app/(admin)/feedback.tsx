import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

interface Feedback {
  id: number;
  toilet_id: number;
  user_id: string;
  rating: number | null;
  cleanliness: number | null;
  comment: string | null;
  created_at: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  user_role?: string;
  toilet_name?: string;
}

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchFeedbacks = async () => {
    try {
      // First fetch all feedbacks
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback")
        .select(`
          id,
          toilet_id,
          user_id,
          rating,
          cleanliness,
          comment,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (feedbackError) throw feedbackError;

      if (!feedbackData || feedbackData.length === 0) {
        setFeedbacks([]);
        return;
      }

      // Get unique user IDs and toilet IDs
      const userIds = [...new Set(feedbackData.map(f => f.user_id))];
      const toiletIds = [...new Set(feedbackData.map(f => f.toilet_id))];

      // Fetch users data
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, name, email, phone, role")
        .in("id", userIds);

      if (usersError) throw usersError;

      // Fetch toilets data
      const { data: toiletsData, error: toiletsError } = await supabase
        .from("toilets")
        .select("id, name")
        .in("id", toiletIds);

      if (toiletsError) throw toiletsError;

      // Create maps for quick lookup
      const userMap = new Map(
        usersData?.map(user => [user.id, user]) || []
      );
      
      const toiletMap = new Map(
        toiletsData?.map(toilet => [toilet.id, toilet]) || []
      );

      // Combine all data
      const combinedFeedbacks = feedbackData.map(feedback => {
        const user = userMap.get(feedback.user_id);
        const toilet = toiletMap.get(feedback.toilet_id);
        
        return {
          ...feedback,
          user_name: user?.name || 'Unknown User',
          user_email: user?.email || '',
          user_phone: user?.phone || '',
          user_role: user?.role || 'user',
          toilet_name: toilet?.name || 'Unknown Toilet'
        };
      });

      setFeedbacks(combinedFeedbacks);
    } catch (error) {
      console.log("Feedback fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
    return (
      <View className="flex-row">
        {[...Array(5)].map((_, index) => (
          <Ionicons
            key={index}
            name={index < rating ? "star" : "star-outline"}
            size={16}
            color={index < rating ? "#FBBF24" : "#9CA3AF"}
          />
        ))}
      </View>
    );
  };

  const getRatingColor = (rating: number | null) => {
    if (!rating) return "bg-gray-100 text-gray-600";
    if (rating >= 4) return "bg-green-100 text-green-700";
    if (rating >= 3) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-gray-500">Loading feedbacks...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2563EB"]} />
      }
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">Feedback Management</Text>
        <Text className="text-sm text-gray-600 mt-1">
          View all user feedback across toilets
        </Text>
      </View>

      {/* Stats Cards */}
      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">Total</Text>
            <View className="bg-blue-100 p-2 rounded-lg">
              <Ionicons name="chatbubble-outline" size={20} color="#2563EB" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mt-2">{feedbacks.length}</Text>
        </View>

        <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">Avg Rating</Text>
            <View className="bg-yellow-100 p-2 rounded-lg">
              <Ionicons name="star" size={20} color="#FBBF24" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mt-2">
            {(feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / 
              (feedbacks.filter(f => f.rating).length || 1)).toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Feedback List */}
      <View className="space-y-4">
        {feedbacks.length > 0 ? (
          feedbacks.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Main Content */}
              <TouchableOpacity
                onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
                activeOpacity={0.7}
                className="p-4"
              >
                {/* Header with Toilet Info */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center space-x-2">
                    <View className="bg-blue-50 px-3 py-1 rounded-full flex-row items-center">
                      <Ionicons name="home-outline" size={14} color="#2563EB" />
                      <Text className="text-xs font-medium text-blue-700 ml-1">
                        #{item.toilet_id}
                      </Text>
                    </View>
                    {item.toilet_name && (
                      <Text className="text-sm text-gray-600">
                        {item.toilet_name}
                      </Text>
                    )}
                  </View>
                  <Ionicons 
                    name={expandedId === item.id ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </View>

                {/* User Info */}
                <View className="flex-row items-start mb-3">
                  <View className="bg-gray-100 rounded-full p-2 mr-3">
                    <Ionicons name="person-outline" size={20} color="#4B5563" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-medium text-gray-900">
                        {item.user_name}
                      </Text>
                      <View className={`px-2 py-1 rounded-full ${item.user_role === 'admin' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        <Text className={`text-xs capitalize ${item.user_role === 'admin' ? 'text-purple-700' : 'text-gray-700'}`}>
                          {item.user_role}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="mail-outline" size={12} color="#9CA3AF" />
                      <Text className="text-xs text-gray-500 ml-1">
                        {item.user_email}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Ratings */}
                <View className="flex-row flex-wrap gap-4 mb-3">
                  {item.rating && (
                    <View>
                      <Text className="text-xs text-gray-500 mb-1">Rating</Text>
                      <View className="flex-row items-center">
                        {renderStars(item.rating)}
                        <Text className={`text-xs ml-2 px-2 py-0.5 rounded-full ${getRatingColor(item.rating)}`}>
                          {item.rating}/5
                        </Text>
                      </View>
                    </View>
                  )}
                  
                  {item.cleanliness && (
                    <View>
                      <Text className="text-xs text-gray-500 mb-1">Cleanliness</Text>
                      <View className="flex-row items-center">
                        {renderStars(item.cleanliness)}
                        <Text className={`text-xs ml-2 px-2 py-0.5 rounded-full ${getRatingColor(item.cleanliness)}`}>
                          {item.cleanliness}/5
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Comment */}
                {item.comment && (
                  <View className="bg-gray-50 rounded-lg p-3 mb-3">
                    <Text className="text-gray-700 text-sm italic">
                      "{item.comment}"
                    </Text>
                  </View>
                )}

                {/* Timestamp */}
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {formatDate(item.created_at)}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Expanded Details */}
              {expandedId === item.id && (
                <View className="border-t border-gray-100 bg-gray-50 p-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Additional Details
                  </Text>
                  <View className="space-y-2">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-500">Feedback ID</Text>
                      <Text className="text-xs font-mono text-gray-900">{item.id}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-500">User ID</Text>
                      <Text className="text-xs font-mono text-gray-900">{item.user_id}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-500">Toilet ID</Text>
                      <Text className="text-xs font-mono text-gray-900">{item.toilet_id}</Text>
                    </View>
                    {item.user_phone && (
                      <View className="flex-row justify-between">
                        <Text className="text-xs text-gray-500">Phone</Text>
                        <Text className="text-xs text-gray-900">{item.user_phone}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View className="bg-white p-8 rounded-2xl items-center shadow-sm border border-gray-100">
            <View className="bg-gray-100 rounded-full p-4 mb-3">
              <Ionicons name="document-text-outline" size={32} color="#64748B" />
            </View>
            <Text className="text-gray-500 text-lg font-medium">
              No feedbacks yet
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              User feedback will appear here
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Feedback;