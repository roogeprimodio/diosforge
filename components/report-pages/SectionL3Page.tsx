import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import ZoomablePaper from '../common/ZoomablePaper';

interface SectionL3PageProps {
  chapterNumber: number;
  sectionNumber: number;
  subsectionNumber: number;
  title: string;
  content: string;
}

export const SectionL3Page: React.FC<SectionL3PageProps> = ({
  chapterNumber = 1,
  sectionNumber = 1,
  subsectionNumber = 1,
  title = 'Technical Challenges',
  content = 'Detailed technical implementation challenges...',
}) => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: Dimensions.get('window').height, backgroundColor: colors.background }}>
      <View style={styles.a4Container}>
        <ZoomablePaper style={{
          flex: 1,
          borderRadius: 2 * SCALE_FACTOR,
          backgroundColor: colors.surface,
          shadowColor: colors.shadow || colors.text + '80',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 10,
          borderWidth: 1,
          borderColor: colors.border + '50',
        }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.subsectionNumber, { color: colors.primary }]}>{chapterNumber}.{sectionNumber}.{subsectionNumber}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.content, { color: colors.text }]}>{content}</Text>
          </ScrollView>
        </ZoomablePaper>
      </View>
    </View>
  );
};

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE_FACTOR = SCREEN_WIDTH / A4_WIDTH;

const styles = StyleSheet.create({
  a4Container: {
    width: A4_WIDTH * SCALE_FACTOR,
    height: A4_HEIGHT * SCALE_FACTOR,
    padding: 20 * SCALE_FACTOR,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  subsectionNumber: { fontSize: 14, color: '#4070b5', marginBottom: 8 },
  title: { fontWeight: '500', fontSize: 18, marginBottom: 16, color: '#222' },
  content: { fontSize: 15, lineHeight: 22, color: '#444' },
});
