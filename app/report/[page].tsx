import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams } from 'expo-router';
import { AppBar } from '@/components/AppBar';
import { BottomNavBar } from '@/components/BottomNavBar';
import { useTheme } from '@/context/ThemeContext';
import { ReportBottomSheet } from '@/components/ReportBottomSheet';
import { AlertTriangle, Sun, Moon } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {
  CertificatePage,
  AbstractPage,
  AcknowledgmentPage,
  DeclarationPage,
  IndexPage,
  AbbreviationsPage,
  FiguresPage,
  TablesPage
} from '@/components/report-pages';
import { CoverPage } from '@/components/report-pages/CoverPage';

type PageParams = {
  page: string;
};

type PageComponent = React.ComponentType<any>;

const pages: Record<string, PageComponent> = {
  'CertificatePage': CertificatePage,
  'CoverPage': CoverPage,
  'AbstractPage': AbstractPage,
  'AcknowledgmentPage': AcknowledgmentPage,
  'DeclarationPage': DeclarationPage,
  'IndexPage': IndexPage,
  'AbbreviationsPage': AbbreviationsPage,
  'FiguresPage': FiguresPage,
  'TablesPage': TablesPage
};

export default function ReportPage() {
  const { page } = useLocalSearchParams<PageParams>();
  const { colors, theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(theme === 'light' ? '0deg' : '180deg', { duration: 300 })}]
  }));

  const handleUpdate = (content: any) => {
    console.log('Updated content:', content);
  };

  const PageComponent = pages[page] || (() => <View />);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AppBar 
          title={page.replace('Page', '')}
          rightButton={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable 
                onPress={toggleTheme} 
                style={{ 
                  opacity: 1, 
                  backgroundColor: colors.primary + '20', 
                  marginRight: 8,
                  padding: 8,
                  borderRadius: 20
                }}
              >
                <Animated.View style={iconAnimatedStyle}>
                  {theme === 'light' ? (
                    <Sun size={22} color={colors.primary} />
                  ) : (
                    <Moon size={22} color={colors.primary} />
                  )}
                </Animated.View>
              </Pressable>
              <Pressable 
                onPress={() => setOpenSheet(true)}
                style={{ 
                  padding: 10,
                  borderRadius: 20
                }}
              >
                <AlertTriangle size={26} color={colors.primary} />
              </Pressable>
            </View>
          }
        />
        
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <PageComponent 
            isEditing={isEditing} 
            onUpdate={handleUpdate}
            onToggleEdit={() => setIsEditing(!isEditing)}
            onOpenBottomSheet={() => setOpenSheet(true)}
          />
        </ScrollView>
        
        <BottomNavBar activeRoute="report" />
        
        <ReportBottomSheet 
          isOpen={openSheet}
          onClose={() => setOpenSheet(false)}
        />
      </View>
    </GestureHandlerRootView>
  );
}