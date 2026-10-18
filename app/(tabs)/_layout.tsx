import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { Theme } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.primary,
        tabBarInactiveTintColor: '#94A3B8',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderColor: Theme.border,
          backgroundColor: '#FFFFFF',
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="dashboard"
              size={focused ? 24 : 22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="join"
        options={{
          title: 'Vào ca thi',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="meeting-room"
              size={focused ? 24 : 22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: 'Kết quả',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="assignment"
              size={focused ? 24 : 22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="appeals"
        options={{
          title: 'Phúc khảo',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="mail-outline"
              size={focused ? 24 : 22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="person-outline"
              size={focused ? 24 : 22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
