import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getFontFamily } from '@/utils/fonts';


interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
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


export const PrimaryButton = ({ label, onPress, loading = false, disabled = false }: PrimaryButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
    className="p-4 rounded-xl mb-4"
    style={{ backgroundColor: Colors.secondaryBlue }}
    activeOpacity={0.8}
  >
    {loading ? (
      <ActivityIndicator color={Colors.white} />
    ) : (
      <Text
        className="text-center font-bold text-lg"
        style={{ color: Colors.white, fontFamily: getFontFamily('rounded') }}
      >
        {label}
      </Text>
    )}
  </TouchableOpacity>
);