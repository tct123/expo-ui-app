import { Stack, useRouter } from "expo-router";
import { Platform, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={Platform.select({
            android: require("../../assets/images/expo-logo.png"),
            ios: "plus",
          })}
          onPress={() => router.push("/new")}
        />
      </Stack.Toolbar>
    </>
  );
}

const styles = StyleSheet.create({});
