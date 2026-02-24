import { View, Text, TouchableOpacity } from 'react-native';
import { getFontFamily } from '@/utils/fonts';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
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

export const Checkbox = ({ checked, onToggle, children }: CheckboxProps) => (
  <TouchableOpacity className="flex-row items-center flex-1" onPress={onToggle}>
    <View
      className="w-5 h-5 border rounded mr-2 items-center justify-center"
      style={{
        borderColor: Colors.secondaryBlue,
        backgroundColor: checked ? Colors.secondaryBlue : 'transparent',
      }}
    >
      {checked && <Text style={{ color: Colors.white, fontSize: 12 }}>✓</Text>}
    </View>
    <Text style={{ color: Colors.mutedFg, fontFamily: getFontFamily('sans'), fontSize: 12 }}>
      {children}
    </Text>
  </TouchableOpacity>
);