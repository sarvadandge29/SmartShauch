import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/theme';

// Color constants
const secondaryBlue = '#2563EB';
const lightBlue = '#DBEAFE';
const white = '#FFFFFF';
const grayText = '#64748B';
const lightGray = '#F1F5F9';

// Safely get font family
const getFontFamily = (type: 'sans' | 'serif' | 'rounded' | 'mono') => {
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

interface IssueTypeButtonProps {
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
}

const IssueTypeButton = ({ label, icon, selected, onPress }: IssueTypeButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 p-3 rounded-xl border-2 flex-row items-center justify-center mr-2 mb-2 ${
      selected ? 'border-secondary' : 'border-lightGray'
    }`}
    style={{ backgroundColor: selected ? lightBlue : white }}
  >
    <Ionicons name={icon as any} size={20} color={selected ? secondaryBlue : grayText} />
    <Text 
      className={`ml-2 ${selected ? 'text-secondary' : 'text-grayText'}`} 
      style={{ fontFamily: getFontFamily('sans') }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default IssueTypeButton;