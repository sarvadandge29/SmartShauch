import { StatusBar } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const TabLayouts = () => {
  return (
    <>
      <StatusBar backgroundColor="#1ca4a4" />
      <Tabs
        screenOptions={{
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: '#FDFDFD',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5,
          },
          headerShown: false,
        }}
      >
        {/* Home - Custom Color */}
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="home"
                size={24}
                color={focused ? '#107ed1' : '#6B7280'}
              />
            ),
          }}
        />

        {/* Feedback - Custom Color (if you have this screen) */}
        <Tabs.Screen
          name="feedback"
          options={{
            title: 'Feedback',
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="message-outline"
                size={24}
                color={focused ? '#107ed1' : '#6B7280'}
              />
            ),
          }}
        />

        {/* Profile - Custom Color */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <FontAwesome5
                name="user-alt"
                size={24}
                color={focused ? '#107ed1' : '#6B7280'}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayouts;