import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { PreferencesProvider } from "../state/preferences";
import { getBrandColors, getNavigationTheme } from "../theme/colors";
import { ColorsProvider } from "../theme/ThemeContext";

export default function RootLayout() {
  return (
    <ColorsProvider>
      <PreferencesProvider>
        <RootLayoutInner />
      </PreferencesProvider>
    </ColorsProvider>
  );
}

function RootLayoutInner() {
  const dark = useColorScheme() === "dark";
  const { primary } = getBrandColors(dark);

  return (
    <>
      <ThemeProvider value={getNavigationTheme(dark, primary)}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen
            name="new"
            options={{
              title: "New Task",
              presentation: "modal",
              headerLargeTitleEnabled: true,
            }}
          />
          <Stack.Screen
            name="restaurant"
            options={{ title: "Beto's Tacos" }}
          />
          <Stack.Screen name="preferences" options={{ title: "Preferences" }} />
        </Stack>
      </ThemeProvider>
      <StatusBar style={dark ? "light" : "dark"} />
    </>
  );
}
