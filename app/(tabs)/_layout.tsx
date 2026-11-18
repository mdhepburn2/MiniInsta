// File: _layout.tsx
// Author: Matthew Hepburn (mhepburn@bu.edu), 11/18/2026
// Description: bottom tab navigator for the logged-in screens (all profiles, feed, user profile)

import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/components/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme];
  const {logout} = useAuth()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.tabIconSelected,
        tabBarInactiveTintColor: c.tabIconDefault,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        headerTitleStyle: { fontSize: 17, fontWeight: '600', color: c.text },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'All Profiles',
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={{
                ios: focused ? 'person.2.fill' : 'person.2',
                android: 'group',
                web: 'group',
              }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={{
                ios: focused ? 'square.stack.fill' : 'square.stack',
                android: 'dynamic_feed',
                web: 'dynamic_feed',
              }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="user_profile"
        options={{
          title: 'You',
          tabBarLabel: 'You', // the screen sets its title to @username; keep the tab label short
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={{
                ios: focused ? 'person.crop.circle.fill' : 'person.crop.circle',
                android: 'account_circle',
                web: 'account_circle',
              }}
              tintColor={color}
              size={26}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {logout()}}
              hitSlop={8}
              accessibilityRole="button"
              style={({ pressed }) => ({ marginRight: 16, opacity: pressed ? 0.5 : 1 })}
              >
              <Text style={{ color: c.tint, fontSize: 17 }}>Log Out</Text>
            </Pressable>
          )
        }}
      />
    </Tabs>
  );
}
