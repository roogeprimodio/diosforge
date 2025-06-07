import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export function AppBar() {
  const { theme, toggleTheme, colors } = useTheme();
  
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(theme === 'light' ? '0deg' : '180deg', { duration: 300 }) }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Creative Studio</Text>
      <Pressable 
        onPress={toggleTheme} 
        style={({ pressed }) => [
          styles.themeToggle,
          { opacity: pressed ? 0.7 : 1, backgroundColor: colors.primary + '20' }
        ]}
      >
        <Animated.View style={iconAnimatedStyle}>
          {theme === 'light' ? (
            <Sun size={22} color={colors.primary} />
          ) : (
            <Moon size={22} color={colors.primary} />
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});