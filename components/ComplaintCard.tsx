import { View, Text } from 'react-native';
import React from 'react';
import StatusBadge from './StatusBadge';

interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    status: 'open' | 'resolved' | 'in-progress';
    toiletId: string;
    toiletName: string;
    date: string;
  };
}

const ComplaintCard = ({ complaint }: ComplaintCardProps) => {
  return (
    <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E3A8A' }}>{complaint.title}</Text>
        <StatusBadge status={complaint.status} />
      </View>
      
      <Text style={{ fontSize: 14, color: '#0F172A', marginBottom: 4 }}>
        {complaint.toiletId} - {complaint.toiletName}
      </Text>
      
      <Text style={{ fontSize: 12, color: '#64748B' }}>
        {complaint.date} • ID: {complaint.id}
      </Text>
    </View>
  );
};

export default ComplaintCard;