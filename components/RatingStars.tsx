import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Color constants
const grayText = '#64748B';
const starColor = '#FBBF24';

interface RatingStarsProps {
  rating: number;
  setRating: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

const RatingStars = ({ rating, setRating, size = 30, readonly = false }: RatingStarsProps) => {
  return (
    <View className="flex-row items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity 
          key={star} 
          onPress={() => !readonly && setRating(star)} 
          className="mr-1"
          disabled={readonly}
        >
          <Ionicons 
            name={star <= rating ? 'star' : 'star-outline'} 
            size={size} 
            color={star <= rating ? starColor : grayText} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RatingStars;