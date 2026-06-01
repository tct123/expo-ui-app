import { Stack, useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={"plus"}
          onPress={() => router.push("/new")}
        />
      </Stack.Toolbar>
    </>
  );
}

const styles = StyleSheet.create({});
