import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useProjects, Project } from '@/context/ProjectsContext';
import { ProjectBottomSheet } from './ProjectBottomSheet';
import { CreditCard as Edit, Trash2, Eye } from 'lucide-react-native';
<<<<<<< HEAD
import { useRouter } from 'expo-router';
=======
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
import Animated, { 
  FadeIn, 
  FadeOut,
  useAnimatedStyle, 
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { colors } = useTheme();
  const { deleteProject } = useProjects();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
<<<<<<< HEAD
  const router = useRouter();
=======
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
  
  // Animation values
  const scale = useSharedValue(1);
  
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 200 });
  };
  
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => deleteProject(project.id), 
          style: "destructive" 
        }
      ]
    );
  };

  const handleInspect = () => {
<<<<<<< HEAD
    // Navigate to project-details screen with params
    router.push({
      pathname: '/project-details',
      params: {
        id: project.id,
        name: project.name,
        details: project.details,
        createdAt: project.createdAt,
      },
    });
  };


=======
    Alert.alert("Coming Soon", "Inspect functionality will be implemented later");
  };

>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Animated.View 
        style={[
          styles.card, 
          cardAnimatedStyle,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          }
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.projectName, { color: colors.primary }]}>
            {project.name}
          </Text>
          <Text style={[styles.date, { color: colors.text + '80' }]}>
            {formatDate(project.createdAt)}
          </Text>
        </View>
        
        <Text 
          style={[styles.projectDetails, { color: colors.text }]}
          numberOfLines={3}
        >
          {project.details}
        </Text>
        
        <View style={styles.actionsContainer}>
          <Pressable
            onPress={() => setIsEditModalVisible(true)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.actionButton,
              { opacity: pressed ? 0.7 : 1, backgroundColor: colors.secondary + '20' }
            ]}
          >
            <Edit size={18} color={colors.secondary} />
          </Pressable>
          
          <Pressable
            onPress={handleDelete}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.actionButton,
              { opacity: pressed ? 0.7 : 1, backgroundColor: colors.error + '20' }
            ]}
          >
            <Trash2 size={18} color={colors.error} />
          </Pressable>
          
          <Pressable
            onPress={handleInspect}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.actionButton,
              { opacity: pressed ? 0.7 : 1, backgroundColor: colors.primary + '20' }
            ]}
          >
            <Eye size={18} color={colors.primary} />
          </Pressable>
        </View>
      </Animated.View>
      
      <ProjectBottomSheet
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        editProject={{
          id: project.id,
          name: project.name,
          details: project.details
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  projectDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});