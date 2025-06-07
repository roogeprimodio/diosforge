import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import ZoomablePaper from '../common/ZoomablePaper';

interface SectionL2PageProps {
  chapterNumber: number;
  sectionNumber: number;
  title: string;
  content?: string;
  subsections?: Array<{
    title: string;
    content: string;
  }>;
}

export const SectionL2Page: React.FC<SectionL2PageProps & { onSubsectionsChange?: (subs: any[]) => void }> = ({
  chapterNumber = 1,
  sectionNumber = 1,
  title = 'Problem Statement',
  content = 'Detailed problem analysis goes here...',
  subsections = [],
  onSubsectionsChange,
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  const [localSubsections, setLocalSubsections] = React.useState(subsections);

  React.useEffect(() => {
    setLocalSubsections(subsections);
  }, [subsections]);

  const handleUpdateSubsections = (subs: any[]) => {
    setLocalSubsections(subs);
    if (onSubsectionsChange) onSubsectionsChange(subs);
  };

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
            <Text style={[styles.sectionNumber, { color: colors.primary }]}>{chapterNumber}.{sectionNumber}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.content, { color: colors.text }]}>{content}</Text>
            {localSubsections.map((subsection, index) => (
              <View key={index} style={styles.subsection}>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/report/[page]',
                      params: {
                        page: 'SectionL3Page',
                        chapterNumber,
                        sectionNumber,
                        subsectionNumber: index + 1,
                        title: subsection.title,
                        content: subsection.content
                      },
                    })
                  }
                >
                  <Text style={[styles.subsectionTitle, { color: colors.primary }]}>{chapterNumber}.{sectionNumber}.{index + 1} {subsection.title}</Text>
                </Pressable>
                <Text style={[styles.subsectionContent, { color: colors.text }]}>{subsection.content}</Text>
              </View>
            ))}
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
  sectionNumber: { fontSize: 14, color: '#4070b5', marginBottom: 8 },
  title: { fontWeight: 'bold', fontSize: 20, marginBottom: 16, color: '#222' },
  content: { fontSize: 16, lineHeight: 24, marginBottom: 24, color: '#444' },
  subsection: { marginBottom: 20 },
  subsectionTitle: { fontWeight: '500', fontSize: 17, marginBottom: 8, color: '#4070b5' },
  subsectionContent: { fontSize: 15, lineHeight: 22, color: '#444' },
});
