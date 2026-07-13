import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionProvider } from '@/store/session';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SessionProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="speaking" options={{ headerShown: true, title: '실전 스피킹' }} />
              <Stack.Screen
                name="pronunciation-feedback"
                options={{ headerShown: true, title: '발음 피드백' }}
              />
              <Stack.Screen
                name="expression-learning"
                options={{ headerShown: true, title: '표현 학습' }}
              />
              <Stack.Screen
                name="expression-summary"
                options={{ headerShown: true, title: '학습 요약' }}
              />
              <Stack.Screen name="review" options={{ headerShown: true, title: '복습' }} />
              <Stack.Screen name="profile" options={{ headerShown: true, title: '프로필' }} />
              <Stack.Screen name="my-info" options={{ headerShown: true, title: '내 정보' }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </SessionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
