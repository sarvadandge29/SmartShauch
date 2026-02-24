import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { getFontFamily } from '@/utils/fonts';

interface FormFieldProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  suffix?: React.ReactNode;
}

const Colors = {
  primaryBlue: '#1E3A8A',
  secondaryBlue: '#2563EB',
  lightBlue: '#DBEAFE',
  white: '#FFFFFF',
  darkBlue: '#0F172A',
  border: '#CBD5E1',
  muted: '#64748B',
  mutedFg: '#475569',
  placeholder: '#94A3B8',
};

export const FormField = ({ label, isPassword = false, ...inputProps }: FormFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text
        className="text-xs mb-1 font-medium"
        style={{ color: Colors.primaryBlue, fontFamily: getFontFamily('sans') }}
      >
        {label}
      </Text>

      <View
        className="border rounded-xl p-1 flex-row items-center justify-between"
        style={{ borderColor: Colors.border }}
      >
        <TextInput
          {...inputProps}
          secureTextEntry={isPassword && !visible}
          className="flex-1 p-3"
          style={{ color: Colors.darkBlue, fontFamily: getFontFamily('sans') }}
          placeholderTextColor={Colors.placeholder}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setVisible(v => !v)}
            className="px-3"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.secondaryBlue}
            />
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
};