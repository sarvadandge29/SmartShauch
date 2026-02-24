import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  setUser: (user: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileForm = ({ user, setUser, onSave, onCancel }: ProfileFormProps) => {
  return (
    <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1E3A8A' }}>Edit Profile</Text>

      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4, color: '#0F172A' }}>Full Name</Text>
        <TextInput
          value={user.name}
          onChangeText={(text) => setUser({...user, name: text})}
          style={{ borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 8, padding: 12, fontSize: 14 }}
          placeholderTextColor="#64748B"
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4, color: '#0F172A' }}>Email</Text>
        <TextInput
          value={user.email}
          onChangeText={(text) => setUser({...user, email: text})}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 8, padding: 12, fontSize: 14 }}
          placeholderTextColor="#64748B"
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4, color: '#0F172A' }}>Phone</Text>
        <TextInput
          value={user.phone}
          onChangeText={(text) => setUser({...user, phone: text})}
          keyboardType="phone-pad"
          style={{ borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 8, padding: 12, fontSize: 14 }}
          placeholderTextColor="#64748B"
        />
      </View>

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={onSave}
          style={{ flex: 1, backgroundColor: '#2563EB', padding: 12, borderRadius: 8, marginRight: 8 }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>Save Changes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={onCancel}
          style={{ flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#F1F5F9' }}
        >
          <Text style={{ textAlign: 'center', color: '#64748B' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileForm;