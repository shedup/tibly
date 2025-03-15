// Navigation structure which are nested.
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { SplashScreen, Stack } from "expo-router";

import "../global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";

import { tokenCache } from "@/cache";
import { ActivityIndicator, Text, View } from "react-native";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  console.log("HERE", publishableKey);
  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }
  const [loaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  console.log("LOD", loaded);

  if (!loaded) {
    return null;
  }
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />;
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />;
          <Stack.Screen name="(root)" options={{ headerShown: false }} />;
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
