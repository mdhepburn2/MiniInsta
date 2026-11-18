import { useAuth } from "@/components/AuthContext";
import { useState } from "react";
import { TextInput, Button } from "react-native";
import { View } from "@/components/Themed";
import { styles } from "@/assets/styles";

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<any>(null);

  const onSubmit = async () => {
    try {
      await login(username, password);
      // no navigation needed, token changes and RootNavigator swaps screens
    } catch (e) {
      setError("Invalid username or password");
    }
  };

  return(
    <View style={styles.container}>
        <TextInput 
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
        />
        <TextInput 
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
        />
        <Button 
        title="Login"
        onPress={onSubmit}
        />
    </View>
  )
}