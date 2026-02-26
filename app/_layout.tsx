import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "@/global.css";
import "react-native-reanimated";
import AuthProvider from "@/context/AuthContext";


export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(maintenance)" options={{ headerShown: false }} />
        <Stack.Screen name="chatRoom" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
