import { StatusBar } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const TabLayouts = () => {
  return (
    <>
      <StatusBar backgroundColor="#1ca4a4" barStyle="dark-content" />
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
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="view-dashboard-variant"
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

        <Tabs.Screen
          name="alert"
          options={{
            title: 'Alert',
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color={focused ? '#107ed1' : '#6B7280'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="all-staff"
          options={{
            title: 'Staff',
            tabBarIcon: ({ focused }) => (
              <FontAwesome6 name="people-group" size={24} color="black" />
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