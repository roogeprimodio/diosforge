import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ImageBackground,
  Dimensions
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import type { BasePageProps } from '@/types/project';
import ZoomablePaper from '../common/ZoomablePaper';

// A4 dimensions at 72dpi (595x842px)
const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE_FACTOR = SCREEN_WIDTH / A4_WIDTH;

// Temporary texture - same as certificate page
const PAPER_TEXTURE = { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAOUlEQVR42u3OMQEAAAQAMJJ7f2g1yCoJ3MzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz8zQMCPwRI1Tj4QwAAAABJRU5ErkJggg==' };

export const CoverPage: React.FC<BasePageProps> = ({
  isEditing = false,
  onUpdate,
  onToggleEdit,
  onOpenBottomSheet
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      paddingBottom: 60, // Space for tab bar
    },
    a4Container: {
      width: A4_WIDTH * SCALE_FACTOR,
      height: A4_HEIGHT * SCALE_FACTOR,
      padding: 20 * SCALE_FACTOR,
    },
    a4Paper: {
      flex: 1,
      padding: 40 * SCALE_FACTOR,
      borderRadius: 2 * SCALE_FACTOR,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow || colors.text + '80',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
      borderWidth: 1,
      borderColor: colors.border + '50',
    },
    title: {
      fontSize: 28 * SCALE_FACTOR,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 100 * SCALE_FACTOR,
      color: colors.text,
    },
    subtitle: {
      fontSize: 16 * SCALE_FACTOR,
      textAlign: 'center',
      marginTop: 20 * SCALE_FACTOR,
      color: colors.text,
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={styles.container}>
        <ImageBackground 
          source={PAPER_TEXTURE} 
          style={[styles.background, { backgroundColor: colors.background }]}
          imageStyle={{ opacity: 0.05 }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: Dimensions.get('window').height }}>
            <View style={styles.a4Container}>
              <ZoomablePaper style={styles.a4Paper}>
                <Text style={styles.title}>PROJECT REPORT</Text>
                <Text style={styles.subtitle}>Submitted by: [Your Name]</Text>
                {/* Add more cover content as needed */}
              </ZoomablePaper>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};