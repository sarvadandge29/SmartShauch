import { Text, TouchableOpacity } from 'react-native';
import { getFontFamily } from '@/utils/fonts';

interface TextLinkProps {
  prefix?: string;
  label: string;
  onPress: () => void;
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


export const TextLink = ({ prefix, label, onPress, disabled }: TextLinkProps) => (
  <TouchableOpacity onPress={onPress} className="mt-2" disabled={disabled}>
    <Text
      className="text-center"
      style={{ color: Colors.muted, fontFamily: getFontFamily('sans') }}
    >
      {prefix && `${prefix} `}
      <Text style={{ color: Colors.secondaryBlue, fontWeight: '600' }}>{label}</Text>
    </Text>
  </TouchableOpacity>
);