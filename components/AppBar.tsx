import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

<<<<<<< HEAD
interface AppBarProps {
  title?: string;
  rightButton?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function AppBar({ title, rightButton, showBackButton, onBack }: AppBarProps) {
=======
export function AppBar() {
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
  const { theme, toggleTheme, colors } = useTheme();
  
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(theme === 'light' ? '0deg' : '180deg', { duration: 300 }) }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
<<<<<<< HEAD
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showBackButton && (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>‹</Text>
          </Pressable>
        )}
        {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
      </View>
      <View style={styles.rightContainer}>
        {rightButton ? (
          rightButton
        ) : (
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
        )}
      </View>
=======
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
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    height: 80,
=======
    height: 60,
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
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
<<<<<<< HEAD
    fontSize: 26,
    marginLeft: 8,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
=======
    fontSize: 18,
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
<<<<<<< HEAD
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
=======
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
});