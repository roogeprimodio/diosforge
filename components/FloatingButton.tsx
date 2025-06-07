import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '@/context/ThemeContext';
import { Plus } from 'lucide-react-native';

interface GenerationIconProps {
  onPress?: () => void;
  icon?: React.ReactNode;
  initialX?: number;
  initialY?: number;
}

export const GenerationIcon: React.FC<GenerationIconProps> = ({
  onPress,
  icon,
  initialX = 30,
  initialY = 600,
}) => {
  const { colors } = useTheme();
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value += e.translationX;
      translateY.value += e.translationY;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.fab, animatedStyle, { backgroundColor: colors.primary }]}> 
        <Pressable onPress={onPress} style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          {icon || <Plus color="#fff" size={28} />}
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 100,
  },
});
