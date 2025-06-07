import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { AcknowledgmentPageProps } from './types';
import ZoomablePaper from '../common/ZoomablePaper';

// A4 dimensions at 72dpi (595x842px)
const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE_FACTOR = SCREEN_WIDTH / A4_WIDTH;

// Temporary texture - same as other pages
const PAPER_TEXTURE = { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAOUlEQVR42u3OMQEAAAQAMJJ7f2g1yCoJ3MzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz8zQMCPwRI1Tj4QwAAAABJRU5ErkJggg==' };

export function AcknowledgmentPage({ 
  isEditing = false, 
  onUpdate,
  studentName = 'Student Name',
  acknowledgmentText = 'I would like to express my sincere gratitude to...',
  regards = 'Regards,'
}: AcknowledgmentPageProps) {
  const { colors } = useTheme();
  const [content, setContent] = useState(acknowledgmentText);

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
      fontWeight: 'bold',
      fontSize: 20 * SCALE_FACTOR,
      marginTop: 36 * SCALE_FACTOR,
      marginBottom: 24 * SCALE_FACTOR,
      textAlign: 'center',
      color: colors.text,
    },
    input: {
      fontSize: 16 * SCALE_FACTOR,
      textAlign: 'center',
      color: colors.text,
      marginTop: 12 * SCALE_FACTOR,
      padding: 8 * SCALE_FACTOR,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    content: {
      fontSize: 16 * SCALE_FACTOR,
      textAlign: 'center',
      color: colors.text,
      marginTop: 12 * SCALE_FACTOR,
    },
    regards: {
      marginTop: 48 * SCALE_FACTOR,
      fontSize: 16 * SCALE_FACTOR,
      fontWeight: '500',
      textAlign: 'left',
      alignSelf: 'flex-start',
      color: colors.text,
    },
    name: {
      fontWeight: 'bold',
      fontSize: 17 * SCALE_FACTOR,
      marginTop: 4 * SCALE_FACTOR,
      textAlign: 'left',
      alignSelf: 'flex-start',
      color: colors.text,
    },
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
                <Text style={styles.title}>ACKNOWLEDGMENT</Text>
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={content}
                      onChangeText={(text) => {
                        setContent(text);
                        onUpdate?.({
                          acknowledgmentText: text,
                          studentName,
                          regards
                        });
                      }}
                      multiline
                    />
                    <TextInput
                      style={styles.input}
                      value={studentName}
                      onChangeText={(text) => onUpdate?.({
                        acknowledgmentText: content,
                        studentName: text,
                        regards
                      })}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.content}>{content}</Text>
                    <Text style={styles.regards}>{regards}</Text>
                    <Text style={styles.name}>{studentName}</Text>
                  </>
                )}
              </ZoomablePaper>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}
