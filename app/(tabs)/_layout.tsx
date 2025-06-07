import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { FolderKanban, Palette, User } from 'lucide-react-native';
import { AppBar } from '@/components/AppBar';

export default function TabLayout() {
  const { colors } = useTheme();
  
  return (
    <>
      <AppBar />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBar,
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
          tabBarLabelStyle: styles.tabBarLabel,
        }}>
        <Tabs.Screen
          name="project"
          options={{
            title: 'Projects',
            tabBarIcon: ({ color, size }) => <FolderKanban size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="canvas"
          options={{
            title: 'Canvas',
            tabBarIcon: ({ color, size }) => <Palette size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  }
});