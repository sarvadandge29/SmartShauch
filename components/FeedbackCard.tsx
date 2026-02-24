import { View, Text } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import RatingStars from './RatingStars';
import { Fonts } from '@/constants/theme';

// Color constants
const primaryBlue = '#1E3A8A';
const secondaryBlue = '#2563EB';
const lightBlue = '#DBEAFE';
const darkBlue = '#0F172A';
const grayText = '#64748B';
const lightGray = '#F1F5F9';

// Define interface for feedback
interface Feedback {
  id: string;
  userName: string;
  rating: number;
  cleanliness: number;
  issue: string;
  comment: string;
  timeAgo: string;
}

interface FeedbackCardProps {
  feedback: Feedback;
}

// Safely get font family
const getFontFamily = (type: 'sans' | 'serif' | 'rounded' | 'mono'): string => {
  try {
    if (Fonts && Fonts[type]) {
      return Fonts[type];
    }
  } catch (error) {
    console.log('Font error:', error);
  }
  const fallbacks = {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Courier New',
  };
  return fallbacks[type];
};

const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  const getIssueIcon = (issue: string): string => {
    switch(issue) {
      case 'Bad Smell': return 'alert-circle';
      case 'No Water': return 'water';
      case 'Broken Flush': return 'construct';
      case 'Dirty': return 'trash';
      default: return 'information-circle';
    }
  };

  return (
    <View className="bg-white p-4 rounded-xl mb-3 shadow-sm border" style={{ borderColor: lightGray }}>
      {/* User Info */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: lightBlue }}>
            <Text style={{ fontFamily: getFontFamily('sans'), color: primaryBlue }}>
              {feedback.userName.charAt(0)}
            </Text>
          </View>
          <Text className="ml-2 font-semibold" style={{ fontFamily: getFontFamily('sans'), color: darkBlue }}>
            {feedback.userName}
          </Text>
        </View>
        <Text className="text-xs" style={{ fontFamily: getFontFamily('sans'), color: grayText }}>
          {feedback.timeAgo}
        </Text>
      </View>
      
      {/* Ratings */}
      <View className="flex-row items-center mb-2">
        <RatingStars rating={feedback.rating} setRating={() => {}} size={16} readonly={true} />
        <Text className="ml-2 text-xs" style={{ fontFamily: getFontFamily('sans'), color: grayText }}>
          Cleanliness: {feedback.cleanliness}/5
        </Text>
      </View>
      
      {/* Issue Type */}
      <View className="flex-row items-center mb-2">
        <Ionicons name={getIssueIcon(feedback.issue) as any} size={16} color={secondaryBlue} />
        <Text className="ml-2 text-sm font-medium" style={{ fontFamily: getFontFamily('sans'), color: primaryBlue }}>
          {feedback.issue}
        </Text>
      </View>
      
      {/* Comment */}
      <Text className="text-sm" style={{ fontFamily: getFontFamily('sans'), color: '#4B5563' }}>
        {feedback.comment}
      </Text>
    </View>
  );
};

export default FeedbackCard;