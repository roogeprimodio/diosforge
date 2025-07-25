import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProjectsProvider } from '@/context/ProjectsContext';
<<<<<<< HEAD
import { AIProvider } from '@/context/AIContext';
=======
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium, 
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
<<<<<<< HEAD
      <AIProvider>
        <ProjectsProvider>
          <StatusBar hidden={true} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="project-details" options={{ animation: 'fade_from_bottom' }} />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          </Stack>
        </ProjectsProvider>
      </AIProvider>
=======
      <ProjectsProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
      </ProjectsProvider>
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
    </ThemeProvider>
  );
}