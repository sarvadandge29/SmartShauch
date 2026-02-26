import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert as RNAlert,
  ActivityIndicator,
  RefreshControl,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

interface Alert {
  id: number;
  alert: string;
  created_at: string;
}

const AlertPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Filter/Sort states
  const [sortDescending, setSortDescending] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: !sortDescending });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      RNAlert.alert("Error", "Failed to load alerts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
  };

  const createAlert = async () => {
    if (!alertText.trim()) {
      RNAlert.alert("Error", "Please enter an alert message");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("alerts")
        .insert({
          alert: alertText.trim(),
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      RNAlert.alert("Success", "Alert created successfully");
      setAlertText("");
      setModalVisible(false);
      fetchAlerts();
    } catch (error) {
      console.error("Error creating alert:", error);
      RNAlert.alert("Error", "Failed to create alert");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAlert = async (id: number) => {
    RNAlert.alert(
      "Delete Alert",
      "Are you sure you want to delete this alert?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("alerts")
                .delete()
                .eq("id", id);

              if (error) throw error;
              
              RNAlert.alert("Success", "Alert deleted successfully");
              fetchAlerts();
            } catch (error) {
              console.error("Error deleting alert:", error);
              RNAlert.alert("Error", "Failed to delete alert");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleSort = () => {
    setSortDescending(!sortDescending);
    setAlerts([...alerts].reverse());
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-gray-500">Loading alerts...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Alerts</Text>
            <Text className="text-sm text-gray-600 mt-1">
              {alerts.length} active {alerts.length === 1 ? 'alert' : 'alerts'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-blue-600 px-4 py-2 rounded-xl flex-row items-center"
          >
            <Ionicons name="add" size={22} color="white" />
            <Text className="text-white font-medium ml-1">New Alert</Text>
          </TouchableOpacity>
        </View>

        {/* Sort and Filter Bar */}
        <View className="flex-row items-center justify-between mt-4">
          <TouchableOpacity
            onPress={toggleSort}
            className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
          >
            <Ionicons 
              name={sortDescending ? "arrow-down" : "arrow-up"} 
              size={16} 
              color="#4B5563" 
            />
            <Text className="text-gray-700 text-sm ml-1">
              {sortDescending ? "Newest First" : "Oldest First"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onRefresh}
            className="p-2"
          >
            <Ionicons name="refresh" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Alerts List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2563EB"]} />
        }
      >
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <View
              key={alert.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
            >
              <View className="flex-row">
                {/* Alert Icon */}
                <View className="mr-3">
                  <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
                    <Ionicons name="alert-circle" size={24} color="#DC2626" />
                  </View>
                </View>

                {/* Alert Content */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-gray-900">
                      Alert #{alerts.length - index}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-xs text-gray-500 mr-2">
                        {formatDate(alert.created_at)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => deleteAlert(alert.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <Text className="text-gray-800 mt-2 leading-5">
                    {alert.alert}
                  </Text>

                  {/* Timestamp for mobile */}
                  <View className="flex-row items-center mt-3">
                    <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                    <Text className="text-xs text-gray-400 ml-1">
                      {new Date(alert.created_at).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-white p-8 rounded-2xl items-center mt-4">
            <View className="bg-gray-100 rounded-full p-4 mb-3">
              <Ionicons name="notifications-off-outline" size={32} color="#64748B" />
            </View>
            <Text className="text-gray-500 text-lg font-medium">No alerts</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              No alerts have been created yet.{"\n"}
              Tap "New Alert" to create one.
            </Text>
          </View>
        )}
        <View className="h-4" />
      </ScrollView>

      {/* Create Alert Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">Create New Alert</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Alert Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Alert Message
              </Text>
              <TextInput
                className="border border-gray-200 rounded-xl p-4 text-gray-900 min-h-[120px]"
                placeholder="Enter alert message..."
                value={alertText}
                onChangeText={setAlertText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
                autoFocus
              />
              <Text className="text-xs text-gray-500 mt-2">
                This alert will be visible to all users
              </Text>
            </View>

            {/* Preview */}
            {alertText.trim() !== "" && (
              <View className="mb-6 p-4 bg-gray-50 rounded-xl">
                <Text className="text-sm font-medium text-gray-700 mb-2">Preview:</Text>
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-2">
                    <Ionicons name="alert-circle" size={16} color="#DC2626" />
                  </View>
                  <Text className="text-gray-800 flex-1">{alertText}</Text>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setAlertText("");
                }}
                className="flex-1 bg-gray-100 py-4 rounded-xl"
              >
                <Text className="text-gray-700 text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={createAlert}
                disabled={submitting || !alertText.trim()}
                className={`flex-1 py-4 rounded-xl ${
                  submitting || !alertText.trim() ? "bg-blue-300" : "bg-blue-600"
                }`}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center font-medium">Create Alert</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button for quick create (alternative) */}
      {!modalVisible && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AlertPage;