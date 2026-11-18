import { SymbolView } from 'expo-symbols';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/components/AuthContext';
import { Text } from '@/components/Themed';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {logout} = useAuth()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'All Profiles',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'book',
                android: 'book',
                web: 'book',
              }}
              tintColor={color}
              size={28}
            />
          ),
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable style={{ marginRight: 15 }}>
          //       {({ pressed }) => (
          //         <SymbolView
          //           name={{ ios: 'info.circle', android: 'info', web: 'info' }}
          //           size={25}
          //           tintColor={Colors[colorScheme].text}
          //           style={{ opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        }}
      />
      <Tabs.Screen
        name="user_profile"
        options={{
          title: 'You',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'person',
                android: 'person',
                web: 'person',
              }}
              tintColor={color}
              size={28}
            />
          ),
          headerRight: () => (
            <Pressable 
              style={{marginRight:15}}
              onPress={() => {logout()}}
              >
              <Text>Logout</Text>
            </Pressable>
          )
        }}        
      />
    </Tabs>
  );
}
