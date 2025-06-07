import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ImageBackground, Dimensions, SafeAreaView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { BasePageProps } from './types';
import ZoomablePaper from '../common/ZoomablePaper';

interface AbbreviationsPageProps extends BasePageProps {
  abbreviations?: Record<string, string>;
}

const PAPER_TEXTURE = { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAOUlEQVR42u3OMQEAAAQAMJJ7f2g1yCoJ3MzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz8zQMCPwRI1Tj4QwAAAABJRU5ErkJggg==' };

export function AbbreviationsPage({ 
  isEditing = false, 
  onUpdate,
  abbreviations = {
    'API': 'Application Programming Interface',
    'UI': 'User Interface',
    'UX': 'User Experience'
  }
}: AbbreviationsPageProps) {
  const { colors } = useTheme();
  const [content, setContent] = useState(
    Object.entries(abbreviations)
      .map(([abbr, desc]) => `${abbr}: ${desc}`)
      .join('\n')
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ImageBackground source={PAPER_TEXTURE} style={{ flex: 1 }} imageStyle={{ opacity: 0.05 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: Dimensions.get('window').height }}>
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
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[styles.title, { color: colors.text }]}>LIST OF ABBREVIATIONS</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      value={content}
                      onChangeText={(text) => {
                        setContent(text);
                        const newAbbreviations = text
                          .split('\n')
                          .filter(line => line.includes(':'))
                          .reduce((acc, line) => {
                            const [abbr, ...descParts] = line.split(':');
                            const description = descParts.join(':').trim();
                            if (abbr && description) {
                              acc[abbr.trim()] = description;
                            }
                            return acc;
                          }, {} as Record<string, string>);
                        onUpdate?.(newAbbreviations);
                      }}
                      multiline
                    />
                  ) : (
                    <View style={styles.itemsContainer}>
                      {Object.entries(abbreviations).map(([abbr, desc], index) => (
                        <View key={index} style={styles.item}>
                          <Text style={[styles.abbreviation, { color: colors.text }]}>{abbr}</Text>
                          <Text style={[styles.description, { color: colors.text }]}>{desc}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>
            </ZoomablePaper>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

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
    paddingTop: 32, // space below app bar
    paddingBottom: 60, // space above bottom tab bar
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  itemsContainer: {
    marginTop: 16
  },
  item: {
    flexDirection: 'row',
    marginBottom: 12
  },
  abbreviation: {
    width: 80,
    fontWeight: 'bold'
  },
  description: {
    flex: 1
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8
  }
});
