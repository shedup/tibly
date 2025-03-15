import { Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
<<<<<<< HEAD
import { useAuth } from "@clerk/clerk-expo";

const Home = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)/home"} />;
  }
=======

const Home = () => {
>>>>>>> d3a0859e56b50e0e3d2e211d1fbaae3c7b8f3e03
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;
