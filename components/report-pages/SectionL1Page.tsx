import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import ZoomablePaper from '../common/ZoomablePaper';
import { generateWithTinyLlama } from '../../tinyllama';

type Section = {
  title: string;
  content: string;
  subsections?: Section[];
};

interface SectionL1PageProps {
  chapterNumber: number;
  title: string;
  content?: string;
  sections?: Section[];
}

export const SectionL1Page: React.FC<SectionL1PageProps> = ({
  chapterNumber = 1,
  title = 'Introduction',
  content = 'This chapter introduces the project background, objectives and scope.',
  sections: initialSections = [],
}) => {
  const { colors } = useTheme();
  const [sections, setSections] = React.useState<Section[]>(initialSections);
  const [mainContent, setMainContent] = React.useState<string | undefined>(undefined);

  // Recursively render sections and subsections
  const renderSections = (
    sections: Section[],
    prefix: string = `${chapterNumber}`
  ) => {
    return sections.map((section, idx) => {
      const currentNumber = `${prefix}.${idx + 1}`;
      return (
        <View key={currentNumber} style={styles.subsection}>
          <Text style={[styles.subsectionTitle, { color: colors.primary }]}> {currentNumber} {section.title} </Text>
          <Text style={[styles.subsectionContent, { color: colors.text }]}>{section.content}</Text>
          <View style={{ flexDirection: 'row', marginVertical: 4 }}>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => handleAddSubsection(section, sections, idx)}
            >
              <Text style={styles.actionButtonText}>+ Subsection</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.secondary || '#888' }]}
              onPress={() => handleGenerateContent(section, sections, idx)}
              disabled={generatingIdx === currentNumber}
            >
              <Text style={styles.actionButtonText}>
                {generatingIdx === currentNumber ? 'Generating...' : 'Generate Content'}
              </Text>
            </Pressable>
          </View>
          {section.subsections && section.subsections.length > 0 && (
            <View style={{ marginLeft: 16 }}>
              {renderSections(section.subsections, currentNumber)}
            </View>
          )}
        </View>
      );
    });
  };

  // Add subsection handler
  const handleAddSubsection = (parent: Section, parentArray: Section[], parentIdx: number) => {
    const newSub = { title: 'New Subsection', content: 'Edit this content', subsections: [] };
    const updatedSections = [...sections];
    // Recursive helper to find and update
    const addSub = (arr: Section[]): boolean => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === parent) {
          arr[i] = { ...arr[i], subsections: [...(arr[i].subsections || []), newSub] };
          return true;
        }
        if (arr[i].subsections && addSub(arr[i].subsections!)) return true;
      }
      return false;
    };
    addSub(updatedSections);
    setSections(updatedSections);
  };

  // TinyLlama integration

// Generate content handler (TinyLlama integration)
  const [generatingIdx, setGeneratingIdx] = React.useState<string | null>(null);

  const handleGenerateContent = async (target: Section, parentArray: Section[], parentIdx: number) => {
    // Find section number for loading state
    const findSectionNumber = (arr: Section[], prefix: string = `${chapterNumber}`): string | null => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return `${prefix}.${i + 1}`;
        if (arr[i].subsections) {
          const found = findSectionNumber(arr[i].subsections!, `${prefix}.${i + 1}`);
          if (found) return found;
        }
      }
      return null;
    };
    const sectionNumber = findSectionNumber(sections);
    setGeneratingIdx(sectionNumber);
    try {
      const prompt = `Write a detailed section for: ${target.title}`;
      const generated = await generateWithTinyLlama(prompt);
      const updatedSections = [...sections];
      const updateContent = (arr: Section[]): boolean => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === target) {
            arr[i] = { ...arr[i], content: generated };
            return true;
          }
          if (arr[i].subsections && updateContent(arr[i].subsections!)) return true;
        }
        return false;
      };
      updateContent(updatedSections);
      setSections(updatedSections);
    } finally {
      setGeneratingIdx(null);
    }
  };

  // Add top-level section
  const handleAddSection = () => {
    setSections([
      ...sections,
      { title: 'New Section', content: 'Edit this content', subsections: [] },
    ]);
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
          <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.chapterNumber, { color: colors.primary }]}>Chapter {chapterNumber}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.content, { color: colors.text }]}>{mainContent ?? content}</Text>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.secondary || '#888', marginBottom: 16 }]}
              onPress={async () => {
                setGeneratingIdx('main');
                const prompt = `Write a detailed section for: ${title}`;
                const generated = await generateWithTinyLlama(prompt);
                setSections(sections => sections); // force re-render if needed
                setMainContent(generated);
                setGeneratingIdx(null);
              }}
              disabled={generatingIdx === 'main'}
            >
              <Text style={styles.actionButtonText}>
                {generatingIdx === 'main' ? 'Generating...' : 'Generate Content'}
              </Text>
            </Pressable>
            {renderSections(sections)}
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.primary, marginTop: 16 }]}
              onPress={handleAddSection}
            >
              <Text style={styles.actionButtonText}>+ Add Section</Text>
            </Pressable>
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
  chapterNumber: { fontSize: 14, color: '#4070b5', marginBottom: 8 },
  title: { fontWeight: 'bold', fontSize: 22, marginBottom: 16, color: '#222' },
  content: { fontSize: 16, lineHeight: 24, marginBottom: 24, color: '#444' },
  subsection: { marginBottom: 20 },
  subsectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 8, color: '#4070b5' },
  subsectionContent: { fontSize: 15, lineHeight: 22, color: '#444' },
  actionButton: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
