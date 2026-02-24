import { View, Text } from 'react-native';
import React from 'react';

interface StatusBadgeProps {
  status: 'open' | 'resolved' | 'in-progress';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch(status) {
      case 'open':
        return { bg: '#FEE2E2', text: '#DC2626', label: 'Open' };
      case 'resolved':
        return { bg: '#D1FAE5', text: '#059669', label: 'Resolved' };
      case 'in-progress':
        return { bg: '#DBEAFE', text: '#2563EB', label: 'In Progress' };
      default:
        return { bg: '#F1F5F9', text: '#64748B', label: status };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={{ backgroundColor: config.bg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
      <Text style={{ color: config.text, fontSize: 12, fontWeight: '500' }}>{config.label}</Text>
    </View>
  );
};

export default StatusBadge;