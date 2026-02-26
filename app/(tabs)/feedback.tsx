import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "@/constants/theme";
import RatingStars from "@/components/RatingStars";
import FeedbackCard from "@/components/FeedbackCard";
import IssueTypeButton from "@/components/IssueTypeButton";
import QRScannerModal from "@/components/QRScannerModal";
import { createFeedback } from "@/utils/actions";
import { supabase } from "@/lib/supabase";

// Color constants
const primaryBlue = "#1E3A8A";
const secondaryBlue = "#2563EB";
const lightBlue = "#DBEAFE";
const white = "#FFFFFF";
const darkBlue = "#0F172A";
const grayText = "#64748B";
const lightGray = "#F1F5F9";

// Define TypeScript interfaces
interface ToiletData {
  id: string;
  name: string;
  location: string;
  type?: string;
  timestamp?: string;
}

interface FeedbackItem {
  id: string;
  userName: string;
  rating: number;
  cleanliness: number;
  issue: string;
  comment: string;
  timeAgo: string;
}

interface IssueType {
  id: string;
  label: string;
  icon: string;
}

// Mock feedback data with proper typing
const MOCK_FEEDBACKS: Record<string, FeedbackItem[]> = {
  "TL-001": [
    {
      id: "1",
      userName: "John D.",
      rating: 4,
      cleanliness: 4,
      issue: "Bad Smell",
      comment: "Clean but needs better ventilation",
      timeAgo: "2 hours ago",
    },
    {
      id: "2",
      userName: "Sarah M.",
      rating: 2,
      cleanliness: 2,
      issue: "No Water",
      comment: "No water supply",
      timeAgo: "5 hours ago",
    },
  ],
  "TL-002": [
    {
      id: "3",
      userName: "Mike R.",
      rating: 5,
      cleanliness: 5,
      issue: "Clean",
      comment: "Very clean",
      timeAgo: "1 day ago",
    },
    {
      id: "4",
      userName: "Emily W.",
      rating: 3,
      cleanliness: 3,
      issue: "Broken Flush",
      comment: "Flush not working",
      timeAgo: "1 day ago",
    },
  ],
  "TL-003": [
    {
      id: "5",
      userName: "Alex K.",
      rating: 1,
      cleanliness: 1,
      issue: "Dirty",
      comment: "Very dirty",
      timeAgo: "2 days ago",
    },
  ],
};

// Safely get font family
const getFontFamily = (type: "sans" | "serif" | "rounded" | "mono"): string => {
  try {
    if (Fonts && Fonts[type]) {
      return Fonts[type];
    }
  } catch (error) {
    console.log("Font error:", error);
  }
  const fallbacks = {
    sans: "System",
    serif: "Georgia",
    rounded: "System",
    mono: "Courier New",
  };
  return fallbacks[type];
};

const Feedback = () => {
  const [scannedToilet, setScannedToilet] = useState<ToiletData | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [selectedIssue, setSelectedIssue] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [cleanliness, setCleanliness] = useState<number>(0);
  const [additionalComments, setAdditionalComments] = useState<string>("");
  const [showFeedbackList, setShowFeedbackList] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  // Issue types with proper typing
  const issueTypes: IssueType[] = [
    { id: "bad-smell", label: "Bad Smell", icon: "alert-circle" },
    { id: "no-water", label: "No Water", icon: "water" },
    { id: "broken-flush", label: "Broken Flush", icon: "construct" },
    { id: "dirty", label: "Dirty", icon: "trash" },
  ];

  // Load feedbacks when toilet is scanned
  useEffect(() => {
    if (scannedToilet) {
      const toiletFeedbacks = MOCK_FEEDBACKS[scannedToilet.id] || [];
      setFeedbacks(toiletFeedbacks);
      setShowFeedbackList(false);
    }
  }, [scannedToilet]);

  const handleScan = (toiletData: ToiletData) => {
    setScannedToilet(toiletData);
    // Reset form
    setSelectedIssue("");
    setRating(0);
    setCleanliness(0);
    setAdditionalComments("");
  };

  const handleSubmitFeedback = async () => {
    if (!selectedIssue) {
      Alert.alert("Error", "Please select an issue type");
      return;
    }

    if (rating === 0 || cleanliness === 0) {
      Alert.alert("Error", "Please complete all ratings");
      return;
    }

    if (!scannedToilet) {
      Alert.alert("Error", "No toilet selected");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Error", "You must be logged in");
      return;
    }

    try {
      await createFeedback({
        toilet_id: Number(scannedToilet.id),
        user_id: user.id,
        issue_type: selectedIssue,
        rating,
        cleanliness,
        comment: additionalComments,
      });

      Alert.alert("Success", "Feedback submitted successfully!");

      setSelectedIssue("");
      setRating(0);
      setCleanliness(0);
      setScannedToilet(null);
      setAdditionalComments("");
    } catch (error) {
      Alert.alert("Error", "Failed to submit feedback");
    }
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: lightGray }}
      contentContainerStyle={
        !scannedToilet ? { flexGrow: 1, justifyContent: "center" } : {}
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor="#1E3A8A" />

      <View
        className="p-4"
        style={!scannedToilet ? { alignItems: "center" } : {}}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4 mt-4">
          <Text
            className="text-2xl font-bold"
            style={{ fontFamily: getFontFamily("serif"), color: primaryBlue }}
          >
            Feedback
          </Text>
        </View>

        {/* QR Scan Section */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          {!scannedToilet ? (
            <TouchableOpacity
              onPress={() => setShowScanner(true)}
              className="items-center py-8"
            >
              <View className="w-20 h-20 bg-lightBlue rounded-full items-center justify-center mb-3">
                <Ionicons name="qr-code" size={40} color={secondaryBlue} />
              </View>
              <Text
                className="text-lg font-semibold mb-1"
                style={{
                  fontFamily: getFontFamily("sans"),
                  color: primaryBlue,
                }}
              >
                Scan Toilet QR
              </Text>
              <Text
                className="text-sm text-grayText text-center"
                style={{ fontFamily: getFontFamily("sans") }}
              >
                Scan the QR code to provide feedback for this toilet
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              <View className="flex-row justify-between items-center mb-3">
                <Text
                  className="text-sm text-grayText"
                  style={{ fontFamily: getFontFamily("sans") }}
                >
                  Scanned Toilet
                </Text>
                <TouchableOpacity onPress={() => setScannedToilet(null)}>
                  <Ionicons name="close-circle" size={24} color={grayText} />
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-lightBlue rounded-full items-center justify-center mr-3">
                  <Ionicons name="location" size={24} color={secondaryBlue} />
                </View>
                <View>
                  <Text
                    className="text-lg font-semibold"
                    style={{
                      fontFamily: getFontFamily("sans"),
                      color: primaryBlue,
                    }}
                  >
                    {scannedToilet.id} - {scannedToilet.name}
                  </Text>
                  <Text
                    className="text-sm text-grayText"
                    style={{ fontFamily: getFontFamily("sans") }}
                  >
                    {scannedToilet.location}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Previous Feedback Toggle */}
        {scannedToilet && (
          <TouchableOpacity
            onPress={() => setShowFeedbackList(!showFeedbackList)}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row justify-between items-center"
          >
            <View className="flex-row items-center">
              <Ionicons name="chatbubbles" size={24} color={secondaryBlue} />
              <Text
                className="ml-3 font-semibold"
                style={{
                  fontFamily: getFontFamily("sans"),
                  color: primaryBlue,
                }}
              >
                Previous Feedback ({feedbacks.length})
              </Text>
            </View>
            <Ionicons
              name={showFeedbackList ? "chevron-up" : "chevron-down"}
              size={24}
              color={grayText}
            />
          </TouchableOpacity>
        )}

        {/* Feedback List */}
        {showFeedbackList && scannedToilet && (
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text
              className="text-lg font-semibold mb-3"
              style={{ fontFamily: getFontFamily("serif"), color: primaryBlue }}
            >
              Recent Feedback
            </Text>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))
            ) : (
              <Text className="text-center py-4" style={{ color: grayText }}>
                No feedback yet for this toilet
              </Text>
            )}
          </View>
        )}

        {/* Feedback Form - Only shown after QR scan */}
        {scannedToilet && (
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text
              className="text-lg font-semibold mb-4"
              style={{ fontFamily: getFontFamily("serif"), color: primaryBlue }}
            >
              Select Issue Type
            </Text>

            <View className="flex-row flex-wrap mb-2">
              {issueTypes.map((issue) => (
                <IssueTypeButton
                  key={issue.id}
                  label={issue.label}
                  icon={issue.icon}
                  selected={selectedIssue === issue.id}
                  onPress={() => setSelectedIssue(issue.id)}
                />
              ))}
            </View>

            {/* Rating Section */}
            <View className="mb-4">
              <Text
                className="text-sm font-medium mb-2"
                style={{ fontFamily: getFontFamily("sans"), color: darkBlue }}
              >
                Overall Rating
              </Text>
              <RatingStars rating={rating} setRating={setRating} />
            </View>

            {/* Cleanliness Rating */}
            <View className="mb-4">
              <Text
                className="text-sm font-medium mb-2"
                style={{ fontFamily: getFontFamily("sans"), color: darkBlue }}
              >
                Cleanliness Rating
              </Text>
              <RatingStars rating={cleanliness} setRating={setCleanliness} />
            </View>

            {/* Additional Comments */}
            <View className="mb-4">
              <Text
                className="text-sm font-medium mb-2"
                style={{ fontFamily: getFontFamily("sans"), color: darkBlue }}
              >
                Additional Comments (Optional)
              </Text>
              <TextInput
                className="border rounded-xl p-4 min-h-[100px]"
                placeholder="Describe the issue in detail..."
                value={additionalComments}
                onChangeText={setAdditionalComments}
                multiline
                textAlignVertical="top"
                style={{
                  borderColor: lightGray,
                  fontFamily: getFontFamily("sans"),
                  color: darkBlue,
                }}
                placeholderTextColor={grayText}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmitFeedback}
              className="bg-secondary p-4 rounded-xl"
              style={{ backgroundColor: secondaryBlue }}
            >
              <Text
                className="text-white text-center font-semibold text-lg"
                style={{ fontFamily: getFontFamily("rounded") }}
              >
                Submit Feedback
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* QR Scanner Modal */}
        <QRScannerModal
          visible={showScanner}
          onClose={() => setShowScanner(false)}
          onScan={handleScan}
        />
      </View>
    </ScrollView>
  );
};

export default Feedback;
