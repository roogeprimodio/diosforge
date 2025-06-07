import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const { colors } = useTheme();
  
  // Mock user data - in a real app, this would come from a user context/state
  const userData = {
    fullName: 'John Doe',
    birthDate: '15 Jan 1995',
    education: {
      college: 'MIT',
      enrollmentNo: 'MIT2020CS045',
      university: 'Massachusetts Institute of Technology'
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.profileHeader, { backgroundColor: colors.primary }]}>
        <View style={styles.profileImagePlaceholder}>
          <Text style={styles.profileInitials}>
            {userData.fullName.split(' ').map(name => name[0]).join('')}
          </Text>
        </View>
        <Text style={styles.profileName}>{userData.fullName}</Text>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Personal Details</Text>
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <InfoRow label="Full Name" value={userData.fullName} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <InfoRow label="Birth Date" value={userData.birthDate} colors={colors} />
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Educational Details</Text>
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <InfoRow label="College" value={userData.education.college} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <InfoRow label="Enrollment No" value={userData.education.enrollmentNo} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <InfoRow label="University" value={userData.education.university} colors={colors} />
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileHeader: {
    paddingTop: 80,
    paddingBottom: 24,
    alignItems: 'center',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInitials: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: '#6200EE',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    flex: 2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
  },
});