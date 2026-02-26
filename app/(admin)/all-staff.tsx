import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

// Mock tasks data structure (will be replaced when you create the tasks table)
interface MockTask {
  id: string;
  toiletName: string;
  assignedDate: string;
  status: "pending" | "in-progress" | "completed";
}

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedStaff, setExpandedStaff] = useState<string | null>(null);
  const router = useRouter();

  // Mock tasks data for demonstration
  const mockTasks: Record<string, MockTask[]> = {
    // This will be populated with real data when you create the tasks table
    staff1: [
      {
        id: "task1",
        toiletName: "Main Building - Ground Floor",
        assignedDate: "2024-01-15",
        status: "in-progress",
      },
      {
        id: "task2",
        toiletName: "Library - First Floor",
        assignedDate: "2024-01-14",
        status: "completed",
      },
    ],
    staff2: [
      {
        id: "task3",
        toiletName: "Sports Complex - Men",
        assignedDate: "2024-01-15",
        status: "pending",
      },
    ],
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, phone, role")
        .eq("role", "maintenance");

      if (error) throw error;
      setStaff(data || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStaff();
    setRefreshing(false);
  };

  const handleOpenChat = (memberId: string, memberName: string) => {
    router.push({
      pathname: "/chatRoom",
      params: { memberId, memberName },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "in-progress":
        return "construct-outline";
      case "completed":
        return "checkmark-circle-outline";
      default:
        return "alert-circle-outline";
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-gray-500">Loading staff...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Maintenance Staff
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {staff.length} staff members
            </Text>
          </View>
          <TouchableOpacity
            onPress={onRefresh}
            className="bg-blue-50 p-2 rounded-lg"
          >
            <Ionicons name="refresh" size={22} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="flex-row px-4 py-4 space-x-3">
        <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-gray-900">
              {staff.length}
            </Text>
            <Ionicons name="people" size={24} color="#2563EB" />
          </View>
          <Text className="text-xs text-gray-600 mt-1">Total Staff</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-yellow-600">3</Text>
            <Ionicons name="construct" size={24} color="#EAB308" />
          </View>
          <Text className="text-xs text-gray-600 mt-1">Active Tasks</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-green-600">5</Text>
            <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
          </View>
          <Text className="text-xs text-gray-600 mt-1">Completed</Text>
        </View>
      </View>

      {/* Staff List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]}
          />
        }
      >
        {staff.length > 0 ? (
          staff.map((member, index) => (
            <View
              key={member.id}
              className="bg-white rounded-xl mb-4 shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Staff Header - Always Visible */}
              <TouchableOpacity
                onPress={() =>
                  setExpandedStaff(
                    expandedStaff === member.id ? null : member.id,
                  )
                }
                className="p-4"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  {/* Avatar with initial */}
                  <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                    <Text className="text-blue-600 font-bold text-lg">
                      {member.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  {/* Staff Info */}
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-semibold text-gray-900 text-base">
                        {member.name}
                      </Text>
                      <Ionicons
                        name={
                          expandedStaff === member.id
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={20}
                        color="#6B7280"
                      />
                    </View>

                    {/* Contact Info */}
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="mail-outline" size={14} color="#6B7280" />
                      <Text className="text-xs text-gray-500 ml-1">
                        {member.email}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="call-outline" size={14} color="#6B7280" />
                      <Text className="text-xs text-gray-500 ml-1">
                        {member.phone}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Status Badge */}
                <View className="absolute top-4 right-4">
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-xs text-green-700">Active</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Expanded Tasks Section */}
              {expandedStaff === member.id && (
                <View className="border-t border-gray-100 bg-gray-50 p-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-3">
                    Current Tasks
                  </Text>

                  {/* Mock Tasks - Replace with real tasks when table exists */}
                  <View className="space-y-3">
                    {/* Sample Task 1 */}
                    <View className="bg-white rounded-lg p-3 border border-gray-200">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <Text className="font-medium text-gray-900">
                            Main Building - Ground Floor
                          </Text>
                          <Text className="text-xs text-gray-500 mt-1">
                            Assigned: Jan 15, 2024
                          </Text>
                        </View>
                        <View
                          className={`px-2 py-1 rounded-full flex-row items-center ${getStatusColor("in-progress")}`}
                        >
                          <Ionicons
                            name={getStatusIcon("in-progress")}
                            size={12}
                            color="currentColor"
                          />
                          <Text className="text-xs capitalize ml-1">
                            In Progress
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Sample Task 2 */}
                    <View className="bg-white rounded-lg p-3 border border-gray-200">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <Text className="font-medium text-gray-900">
                            Library - First Floor
                          </Text>
                          <Text className="text-xs text-gray-500 mt-1">
                            Assigned: Jan 14, 2024
                          </Text>
                        </View>
                        <View
                          className={`px-2 py-1 rounded-full flex-row items-center ${getStatusColor("completed")}`}
                        >
                          <Ionicons
                            name={getStatusIcon("completed")}
                            size={12}
                            color="currentColor"
                          />
                          <Text className="text-xs capitalize ml-1">
                            Completed
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="mt-4">
                      <TouchableOpacity
                        onPress={() => handleOpenChat(member.id, member.name)}
                        className="bg-blue-600 py-3 rounded-xl flex-row items-center justify-center"
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="chatbubble-ellipses-outline"
                          size={18}
                          color="#FFFFFF"
                        />
                        <Text className="text-white font-semibold ml-2">
                          Chat with {member.name}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* No Tasks State */}
                    {/* <View className="py-4 items-center">
                      <Ionicons name="clipboard-outline" size={32} color="#9CA3AF" />
                      <Text className="text-gray-500 text-sm mt-2">No tasks assigned</Text>
                    </View> */}
                  </View>

                  {/* Performance Summary */}
                  <View className="mt-4 pt-3 border-t border-gray-200">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Performance Summary
                    </Text>
                    <View className="flex-row justify-between">
                      <View className="items-center">
                        <Text className="text-lg font-bold text-gray-900">
                          8
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Total Tasks
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-lg font-bold text-green-600">
                          5
                        </Text>
                        <Text className="text-xs text-gray-500">Completed</Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-lg font-bold text-yellow-600">
                          3
                        </Text>
                        <Text className="text-xs text-gray-500">
                          In Progress
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-lg font-bold text-blue-600">
                          95%
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Efficiency
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View className="bg-white p-8 rounded-2xl items-center mt-4">
            <View className="bg-gray-100 rounded-full p-4 mb-3">
              <Ionicons name="people-outline" size={32} color="#64748B" />
            </View>
            <Text className="text-gray-500 text-lg font-medium">
              No staff found
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              No maintenance staff members added yet
            </Text>
          </View>
        )}
        <View className="h-4" />
      </ScrollView>
    </View>
  );
};

export default StaffPage;
