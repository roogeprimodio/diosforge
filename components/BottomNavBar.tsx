import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { FolderKanban, Palette, User } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

interface BottomNavBarProps {
  activeRoute?: string;
}

const TABS = [
  { name: 'Projects', route: '/(tabs)/project' as const, icon: FolderKanban },
  { name: 'Canvas', route: '/(tabs)/canvas' as const, icon: Palette },
  { name: 'Profile', route: '/(tabs)/profile' as const, icon: User },
];

export function BottomNavBar({ activeRoute }: BottomNavBarProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeRoute ? 
          activeRoute === tab.route : 
          pathname === tab.route;

        return (
          <Pressable
            key={tab.route}
            onPress={() => router.push(tab.route)}
            style={styles.tab}
          >
            <Icon 
              color={isActive ? colors.primary : colors.text}
              size={24}
              fill={isActive ? colors.primary : 'transparent'}
            />
            <Text style={[styles.label, {
              color: isActive ? colors.primary : colors.text
            }]}>{tab.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
});
