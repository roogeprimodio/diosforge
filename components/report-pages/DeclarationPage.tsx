import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import ZoomablePaper from '../common/ZoomablePaper';

interface DeclarationPageProps {
  projectTitle?: string;
  studentName?: string;
  guideName?: string;
  bodyText?: string;
}

// A4 dimensions at 72dpi (595x842px)
const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE_FACTOR = SCREEN_WIDTH / A4_WIDTH;

// Temporary texture - same as other pages
const PAPER_TEXTURE = { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAOUlEQVR42u3OMQEAAAQAMJJ7f2g1yCoJ3MzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz8zQMCPwRI1Tj4QwAAAABJRU5ErkJggg==' };

export const DeclarationPage: React.FC<DeclarationPageProps> = ({
  projectTitle = 'FRENZY',
  studentName = '',
  guideName = 'Prof. Kinjal Bagariya',
  bodyText = `We hereby declare that the Internship / Project report submitted along with the Internship /Project entitled "${'FRENZY'}" submitted in partial fulfillment for the degree of Bachelor of Engineering in Information Technology to Gujarat Technological University, Ahmedabad, is a bonafide record of original project work carried out by me at K.J. Institute Of Engineering and Technology under the supervision of Prof. Kinjal Bagariya and that no part of this report has been directly copied from any students' reports or taken from any other source, without providing due reference.`,
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
    institute: {
      fontWeight: 'bold',
      fontSize: 18 * SCALE_FACTOR,
      marginTop: 24 * SCALE_FACTOR,
      textAlign: 'center',
      color: colors.text,
    },
    location: {
      marginBottom: 24 * SCALE_FACTOR,
      textAlign: 'center',
      color: colors.text,
    },
    heading: {
      fontWeight: 'bold',
      fontSize: 20 * SCALE_FACTOR,
      marginVertical: 16 * SCALE_FACTOR,
      textAlign: 'center',
      color: colors.text,
    },
    body: {
      fontSize: 16 * SCALE_FACTOR,
      textAlign: 'center',
      marginVertical: 24 * SCALE_FACTOR,
      color: colors.text,
    },
    signatures: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 48 * SCALE_FACTOR,
    },
    signatureBlock: {
      flex: 1,
      alignItems: 'center',
    },
    signatureLabel: {
      fontSize: 15 * SCALE_FACTOR,
      marginBottom: 8 * SCALE_FACTOR,
      color: colors.text,
    },
    signatureLine: {
      fontSize: 16 * SCALE_FACTOR,
      fontWeight: 'bold',
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
                <Text style={styles.institute}>K.J. Institute of Engineering and Technology</Text>
                <Text style={styles.location}>Savli, Vadodara</Text>
                <Text style={styles.heading}>DECLARATION</Text>
                <Text style={styles.body}>{bodyText}</Text>
                <View style={styles.signatures}>
                  <View style={styles.signatureBlock}>
                    <Text style={styles.signatureLabel}>Name of the Student</Text>
                    <Text style={styles.signatureLine}>____________________</Text>
                  </View>
                  <View style={styles.signatureBlock}>
                    <Text style={styles.signatureLabel}>Sign of Student</Text>
                    <Text style={styles.signatureLine}>____________________</Text>
                  </View>
                </View>
              </ZoomablePaper>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

