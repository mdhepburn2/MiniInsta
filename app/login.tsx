// File: login.tsx
// Author: Matthew Hepburn (mhepburn@bu.edu), 11/18/2026
// Description: login screen where the user signs in to MiniInsta

import { useAuth } from "@/components/AuthContext";
import { useState } from "react";
import { ScrollView, Text, TextInput, View, type TextStyle } from "react-native";
import { SymbolView } from "expo-symbols";
import { useColors } from "@/components/Themed";
import { PillButton } from '@/assets/styles';

export default function LoginScreen() {
  const { login } = useAuth();
  const c = useColors();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<any>(null);

  const onSubmit = async () => {
    try {
      await login(username, password);
      // no navigation needed, token changes and RootNavigator swaps screens
    } catch (e) {
      console.error('Login failed:', e);
      setError("Invalid username or password");
    }
  };

  const field: TextStyle = {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: c.separator,
    backgroundColor: c.surface,
    color: c.text,
    fontSize: 17,
  };

  return(
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 48, gap: 40 }}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
    >
      {/* app mark: the same blue/yellow ring used around profile photos */}
      <View style={{ alignItems: 'center', gap: 16 }}>
        <View
          style={{
            width: 76,
            height: 76,
            padding: 4,
            borderRadius: 38,
            experimental_backgroundImage: `linear-gradient(135deg, ${c.sky} 0%, ${c.sun} 50%, ${c.sky} 100%)`,
          }}
        >
          <View style={{ flex: 1, borderRadius: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: c.background }}>
            <SymbolView name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }} tintColor={c.tint as string} size={30} />
          </View>
        </View>
        <Text style={{ color: c.text, fontSize: 34, fontWeight: '800', letterSpacing: -0.8 }}>MiniInsta</Text>
      </View>

      <View style={{ gap: 12 }}>
        <TextInput
            placeholder="Username"
            placeholderTextColor={c.secondaryText}
            value={username}
            onChangeText={setUsername}
            textContentType="username"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect={false}
            style={field}
        />
        <TextInput
            placeholder="Password"
            placeholderTextColor={c.secondaryText}
            value={password}
            onChangeText={setPassword}
            textContentType="password"
            autoComplete="password"
            secureTextEntry
            style={field}
        />
        <PillButton
        label="Log In"
        onPress={onSubmit}
        style={{ marginTop: 8 }}
        />
      </View>
    </ScrollView>
  )
}
