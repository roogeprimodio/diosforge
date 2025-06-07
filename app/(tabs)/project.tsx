import { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Pressable, Dimensions } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useProjects } from '@/context/ProjectsContext';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectBottomSheet } from '@/components/ProjectBottomSheet';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function ProjectScreen() {
  const { colors } = useTheme();
  const { state } = useProjects();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={[styles.emptyStateText, { color: colors.text }]}>
        No projects yet. Tap the + button to create one.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={state.projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View 
            entering={FadeInUp.delay(index * 100).springify()} 
            style={styles.cardWrapper}
          >
            <ProjectCard project={item} />
          </Animated.View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
      
      <Pressable
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setIsBottomSheetVisible(true)}
      >
        <Plus color="#fff" size={24} />
      </Pressable>
      
      <ProjectBottomSheet
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Provide space for the FAB
    flexGrow: 1,
  },
  cardWrapper: {
    marginBottom: 16,
    width: '100%',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});