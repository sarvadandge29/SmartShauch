import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'user'
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) throw userError
      
      if (!user) {
        router.replace('/(auth)/login')
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      Alert.alert('Error', 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Alert.alert(
      "Logout", 
      "Are you sure you want to logout?",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await supabase.auth.signOut()
              router.replace('/(auth)/login')
            } catch (error) {
              console.error('Logout error:', error)
              Alert.alert('Error', 'Failed to logout')
            }
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header with gradient effect */}
      <View className="bg-blue-600 pt-12 pb-8 px-6 rounded-b-3xl">
        <View className="items-center">
          <View className="bg-white/20 p-4 rounded-full mb-4">
            <Ionicons name="person-circle" size={80} color="white" />
          </View>
          <Text className="text-2xl font-bold text-white mb-2">{profile?.name || 'Admin User'}</Text>
          <View className="bg-white/20 px-3 py-1 rounded-full">
            <Text className="text-white font-medium capitalize">{profile?.role || 'admin'}</Text>
          </View>
        </View>
      </View>

      {/* Profile Details */}
      <View className="flex-1 px-6 pt-8 pb-8">
        <Text className="text-lg font-semibold text-gray-800 mb-4">Profile Information</Text>
        
        {/* Email */}
        <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm border border-gray-100">
          <View className="bg-blue-100 p-2 rounded-lg mr-4">
            <Ionicons name="mail-outline" size={24} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-0.5">Email</Text>
            <Text className="text-base font-medium text-gray-800">{profile?.email}</Text>
          </View>
        </View>

        {/* Phone */}
        <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm border border-gray-100">
          <View className="bg-green-100 p-2 rounded-lg mr-4">
            <Ionicons name="call-outline" size={24} color="#22c55e" />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-0.5">Phone Number</Text>
            <Text className="text-base font-medium text-gray-800">{profile?.phone}</Text>
          </View>
        </View>

        {/* User ID */}
        <View className="bg-white rounded-xl p-4 mb-6 flex-row items-center shadow-sm border border-gray-100">
          <View className="bg-purple-100 p-2 rounded-lg mr-4">
            <Ionicons name="id-card-outline" size={24} color="#a855f7" />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-0.5">User ID</Text>
            <Text className="text-sm font-mono text-gray-800">{profile?.id}</Text>
          </View>
        </View>

        {/* Account Statistics */}
        <Text className="text-lg font-semibold text-gray-800 mb-4">Account Statistics</Text>
        
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Ionicons name="calendar-outline" size={24} color="#3b82f6" />
            <Text className="text-xs text-gray-500 mt-2 mb-0.5">Member since</Text>
            <Text className="text-base font-semibold text-gray-800">{new Date().getFullYear()}</Text>
          </View>
          
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Ionicons name="shield-checkmark-outline" size={24} color="#22c55e" />
            <Text className="text-xs text-gray-500 mt-2 mb-0.5">Status</Text>
            <Text className="text-base font-semibold text-green-600">Active</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 py-4 px-6 rounded-xl flex-row items-center justify-center mt-4 mb-6"
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Profile