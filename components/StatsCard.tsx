import { View, Text } from 'react-native';
import React from 'react';

interface StatsCardProps {
  total: number;
  resolved: number;
}

const StatsCard = ({ total, resolved }: StatsCardProps) => {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
      <View style={{ flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 12, marginRight: 8, borderWidth: 1, borderColor: '#F1F5F9' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E3A8A' }}>{total}</Text>
        <Text style={{ color: '#64748B' }}>Total Reports</Text>
      </View>
      
      <View style={{ flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 12, marginLeft: 8, borderWidth: 1, borderColor: '#F1F5F9' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#059669' }}>{resolved}</Text>
        <Text style={{ color: '#64748B' }}>Resolved</Text>
      </View>
    </View>
  );
};

export default StatsCard;