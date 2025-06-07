import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useProjects } from '@/context/ProjectsContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate 
} from 'react-native-reanimated';

interface ProjectBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  editProject?: {
    id: string;
    name: string;
    details: string;
  };
}

const { height } = Dimensions.get('window');

export function ProjectBottomSheet({ visible, onClose, editProject }: ProjectBottomSheetProps) {
  const { colors } = useTheme();
  const { addProject, editProject: updateProject } = useProjects();
  
  const [projectName, setProjectName] = useState('');
  const [projectDetails, setProjectDetails] = useState('');

  // Animation values
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0);
      opacity.value = withTiming(1, { duration: 200 });
      
      // If we're editing a project, set the form values
      if (editProject) {
        setProjectName(editProject.name);
        setProjectDetails(editProject.details);
      } else {
        // Reset form for new project
        setProjectName('');
        setProjectDetails('');
      }
    } else {
      translateY.value = withSpring(height);
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, editProject]);

  const handleSave = () => {
    if (projectName.trim() === '') {
      return;
    }
    
    if (editProject) {
      updateProject(editProject.id, projectName, projectDetails);
    } else {
      addProject({ name: projectName, details: projectDetails });
    }
    
    onClose();
  };

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    };
  });

  const sheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View
              style={[
                styles.bottomSheet,
                sheetStyle,
                { backgroundColor: colors.surface }
              ]}
            >
              <View style={styles.handle} />
              <Text style={[styles.title, { color: colors.primary }]}>
                {editProject ? 'Edit Project' : 'New Project'}
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Project Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor: colors.background,
                      borderColor: colors.border
                    }
                  ]}
                  placeholder="Enter project name"
                  placeholderTextColor={colors.text + '80'}
                  value={projectName}
                  onChangeText={setProjectName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Project Details</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      color: colors.text,
                      backgroundColor: colors.background,
                      borderColor: colors.border
                    }
                  ]}
                  placeholder="Enter project details"
                  placeholderTextColor={colors.text + '80'}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={projectDetails}
                  onChangeText={setProjectDetails}
                />
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton, { borderColor: colors.border }]} 
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.button, 
                    styles.saveButton, 
                    { backgroundColor: colors.primary }
                  ]} 
                  onPress={handleSave}
                >
                  <Text style={[styles.buttonText, styles.saveButtonText]}>
                    {editProject ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: height * 0.4,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CCCCCC',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 8,
    borderWidth: 1,
  },
  saveButton: {
    marginLeft: 8,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
});