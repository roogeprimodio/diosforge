import React, { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

interface ZoomablePaperProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

const ZoomablePaper: React.FC<ZoomablePaperProps> = ({ children, style }) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(1);
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const gestures = Gesture.Simultaneous(pinchGesture, panGesture);

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View
        style={[
          style,
          {
            transform: [
              { scale: scale },
              { translateX: translateX },
              { translateY: translateY }
            ]
          }
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default ZoomablePaper;
