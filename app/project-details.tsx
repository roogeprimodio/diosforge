import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Button, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppBar } from '@/components/AppBar';
import { ProjectBottomSheet } from '@/components/ProjectBottomSheet';
import { BottomNavBar } from '@/components/BottomNavBar';
import { ReportBottomSheet } from '@/components/ReportBottomSheet';
import type { ProjectSection } from '@/components/ReportBottomSheet';
import { AlertTriangle, Sun, Moon, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAI } from '@/context/AIContext';
import { Pencil } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function ProjectDetailsScreen() {
  const { colors } = useTheme();
  const { aiToken, setAIToken, isGenerating, generateWithAI } = useAI();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [openSheet, setOpenSheet] = useState<null | 'project' | 'report'>(null);
  // Project-specific report sections
  const [reportSections, setReportSections] = useState<ProjectSection[]>([
    { name: 'Introduction' },
    { name: 'Methodology' },
  ]);
  const { theme, toggleTheme: baseToggleTheme } = useTheme();
  // Wrap toggleTheme to always close modals
  const toggleTheme = () => {
    setOpenSheet(null);
    baseToggleTheme();
  };
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(theme === 'light' ? '0deg' : '180deg', { duration: 300 }) }],
    };
  });

  const handleAIGenerate = async () => {
    if (!aiToken) {
      Alert.alert('Token Required', 'Please set your HuggingFace token in settings');
      return;
    }

    const generated = await generateWithAI(`Generate a project description for ${name}`);
    setDetails(generated);
  };

  // Params: id, name, details, createdAt
  // Ensure params are strings (not string[])
  function getParam(param: string | string[] | undefined): string {
    if (Array.isArray(param)) return param[0] || '';
    return param || '';
  }
  const id = getParam(params.id);
  const initialName = getParam(params.name);
  const initialDetails = getParam(params.details);
  const createdAt = getParam(params.createdAt);

  // Form state
  const [name, setName] = useState(initialName);
  const [details, setDetails] = useState(initialDetails);
  const [studentName, setStudentName] = useState('');
  const [enrollment, setEnrollment] = useState('');
  const [college, setCollege] = useState('');
  const [university, setUniversity] = useState('');
  const [teamId, setTeamId] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [hodName, setHodName] = useState('');
  const [guideInternal, setGuideInternal] = useState('');
  const [guideExternal, setGuideExternal] = useState('');
  const [teamMembers, setTeamMembers] = useState<{ name: string; enrollment: string }[]>([]);
  const [collegeLogo, setCollegeLogo] = useState<string | null>(null);
  const [universityLogo, setUniversityLogo] = useState<string | null>(null);

  const addTeamMember = () => setTeamMembers([...teamMembers, { name: '', enrollment: '' }]);
  const removeTeamMember = (idx: number) => setTeamMembers(teamMembers.filter((_, i) => i !== idx));
  const updateTeamMember = (idx: number, field: 'name' | 'enrollment', value: string) => {
    setTeamMembers(members => members.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  async function pickLogo(type: 'college' | 'university') {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      if (type === 'college') setCollegeLogo(result.assets[0].uri);
      else setUniversityLogo(result.assets[0].uri);
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <>
      <AppBar
        rightButton={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Theme Toggle Button (copied from AppBar default) */}
            <Pressable 
              onPress={toggleTheme} 
              style={({ pressed }) => [
                styles.themeToggle,
                { opacity: pressed ? 0.7 : 1, backgroundColor: colors.primary + '20', marginRight: 8 }
              ]}
            >
              <Animated.View style={iconAnimatedStyle}>
                {theme === 'light' ? (
                  <Sun size={22} color={colors.primary} />
                ) : (
                  <Moon size={22} color={colors.primary} />
                )}
              </Animated.View>
            </Pressable>
            {/* AI Generation Button */}
            <Pressable 
              onPress={handleAIGenerate}
              style={[styles.iconButton, {marginRight: 8, padding: 10}]}
              disabled={isGenerating}
            >
              <Sparkles size={26} color={isGenerating ? colors.text + '80' : colors.primary} />
            </Pressable>
            {/* Report Icon */}
            <Pressable onPress={() => setOpenSheet('report')} style={[styles.iconButton, {marginRight: 0, padding: 10}]}> 
              <AlertTriangle size={26} color={colors.primary} />
            </Pressable>
          </View>
        }
      />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={[styles.sectionTitle, { color: colors.primary, textDecorationLine: 'underline' }]}>Project Info</Text>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="Project Name"
          placeholderTextColor={colors.text + '99'}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { height: 80, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="Project Details"
          placeholderTextColor={colors.text + '99'}
          value={details}
          onChangeText={setDetails}
          multiline
        />
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Student / Team Info</Text>
        <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]} placeholder="Name" placeholderTextColor={colors.text + '99'} value={studentName} onChangeText={setStudentName} />
        <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]} placeholder="Enrollment Number" placeholderTextColor={colors.text + '99'} value={enrollment} onChangeText={setEnrollment} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <TextInput style={[styles.input, { flex: 1, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]} placeholder="College Name" placeholderTextColor={colors.text + '99'} value={college} onChangeText={setCollege} />
          <TouchableOpacity onPress={() => pickLogo('college')} style={styles.logoBtn}>
            <Text style={{ color: colors.primary, fontSize: 13 }}>Upload Logo</Text>
          </TouchableOpacity>
        </View>
        {collegeLogo && (
          <Image source={{ uri: collegeLogo }} style={styles.logoImg} resizeMode="contain" />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <TextInput style={[styles.input, { flex: 1, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]} placeholder="University Name" placeholderTextColor={colors.text + '99'} value={university} onChangeText={setUniversity} />
          <TouchableOpacity onPress={() => pickLogo('university')} style={styles.logoBtn}>
            <Text style={{ color: colors.primary, fontSize: 13 }}>Upload Logo</Text>
          </TouchableOpacity>
        </View>
        {universityLogo && (
          <Image source={{ uri: universityLogo }} style={styles.logoImg} resizeMode="contain" />
        )}
        <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]} placeholder="Team ID" placeholderTextColor={colors.text + '99'} value={teamId} onChangeText={setTeamId} />
        <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]} placeholder="Submission Date (YYYY-MM-DD)" placeholderTextColor={colors.text + '99'} value={submissionDate} onChangeText={setSubmissionDate} />
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Faculty Info</Text>
        <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]} placeholder="HOD Name" placeholderTextColor={colors.text + '99'} value={hodName} onChangeText={setHodName} />
        <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]} placeholder="Guide Name (Internal)" placeholderTextColor={colors.text + '99'} value={guideInternal} onChangeText={setGuideInternal} />
        <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]} placeholder="Guide Name (External)" placeholderTextColor={colors.text + '99'} value={guideExternal} onChangeText={setGuideExternal} />
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Team Members</Text>
        {teamMembers.map((member, idx) => (
          <View key={idx} style={styles.teamMemberRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 4, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
              placeholder="Member Name"
              placeholderTextColor={colors.text + '99'}
              value={member.name}
              onChangeText={val => updateTeamMember(idx, 'name', val)}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 4, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
              placeholder="Enrollment"
              placeholderTextColor={colors.text + '99'}
              value={member.enrollment}
              onChangeText={val => updateTeamMember(idx, 'enrollment', val)}
            />
            <TouchableOpacity onPress={() => removeTeamMember(idx)} style={styles.removeBtn}>
              <Text style={{ color: 'red', fontSize: 18 }}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        <Button title="Add Team Member" onPress={addTeamMember} />
        <View style={{ height: 24 }} />
        <Button title="Save" onPress={() => { /* TODO: Save logic */ }} />
        <Text style={[styles.date, { color: colors.text, marginTop: 16 }]}>{createdAt ? `Created: ${new Date(createdAt).toLocaleDateString()}` : ''}</Text>
      </ScrollView>
      <ReportBottomSheet
        isOpen={openSheet === 'report'}
        onClose={() => setOpenSheet(null)}
        sections={reportSections}
        onSectionsChange={setReportSections}
      />
      <ProjectBottomSheet 
        visible={openSheet === 'project'}
        onClose={() => setOpenSheet(null)}
        editProject={{ id, name, details }}
      />
      <BottomNavBar />
      </>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  details: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
  iconButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
    fontFamily: 'Inter-Regular',
  },
  teamMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    marginLeft: 4,
  },
  logoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginLeft: 8,
  },
  logoImg: {
    width: 120,
    height: 60,
    marginBottom: 10,
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
});
