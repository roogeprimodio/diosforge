import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing, runOnJS, useAnimatedGestureHandler } from 'react-native-reanimated';
import { Pencil } from 'lucide-react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

export interface ProjectSection {
  name: string;
  children?: ProjectSection[];
}

interface ReportBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  sections?: ProjectSection[];
  onSectionsChange?: (sections: ProjectSection[]) => void;
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 24,
    minHeight: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  richHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
  },
  headerAccent: {
    width: 5,
    height: 28,
    borderRadius: 3,
    marginRight: 10,
  },
  richHeaderText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginBottom: 2,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  rowText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  projectSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 4,
    borderRadius: 6,
    backgroundColor: 'transparent',
    paddingLeft: 8,
  },
  iconBtn: {
    padding: 5,
    marginLeft: 2,
    borderRadius: 6,
  },
  addSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
  },
  addSectionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export function ReportBottomSheet({ isOpen, onClose, sections: propSections, onSectionsChange }: ReportBottomSheetProps) {
  const { colors } = useTheme();
  const translateY = useSharedValue(height);
  const overlayOpacity = useSharedValue(0);
  const router = useRouter();

  // Local state for editing UI only
  const [editingIdx, setEditingIdx] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [newSectionCount, setNewSectionCount] = React.useState(1);

  // Use controlled sections from props, fallback to demo default
  const sections = propSections ?? [
    { name: 'Introduction', children: [] },
    { name: 'Methodology', children: [] }
  ];
  const setSections = (nextSections: ProjectSection[]) => {
    if (onSectionsChange) onSectionsChange(nextSections);
  };

  // Hierarchical section handlers
  const handleEdit = (idxPath: number[]) => {
    setEditingIdx(idxPath.join('-'));
    const section = getSectionByPath(sections, idxPath);
    setEditTitle(section?.name || '');
  };
  const handleChangeTitle = (newTitle: string) => {
    setEditTitle(newTitle);
  };
  const handleSaveTitle = (idxPath: number[]) => {
    if (editTitle.trim() !== '') {
      const updated = updateSectionByPath(sections, idxPath, { name: editTitle });
      setSections(updated);
    }
    setEditingIdx(null);
    setEditTitle('');
  };
  const handleDelete = (idxPath: number[]) => {
    const updated = deleteSectionByPath(sections, idxPath);
    setSections(updated);
    setEditingIdx(null);
    setEditTitle('');
  };
  const handleAddSection = () => {
    setSections([...sections, { name: `New Section ${newSectionCount}`, children: [] }]);
    setNewSectionCount(newSectionCount + 1);
    setEditingIdx([sections.length].join('-'));
    setEditTitle(`New Section ${newSectionCount}`);
  };
  const handleAddSubSection = (idxPath: number[], depth: number) => {
    if (depth >= 3) return;
    const updated = addSubSectionByPath(sections, idxPath, depth, newSectionCount);
    setSections(updated.sections);
    setNewSectionCount(updated.nextCount);
    setEditingIdx([...idxPath, updated.newChildIdx].join('-'));
    setEditTitle(`New Section ${updated.nextCount - 1}`);
  };

  // Utility functions for hierarchy
  function getSectionByPath(sections: ProjectSection[], path: number[]): ProjectSection | undefined {
    let node: ProjectSection | undefined = undefined;
    let arr = sections;
    for (let i = 0; i < path.length; i++) {
      node = arr[path[i]];
      if (!node) return undefined;
      if (i < path.length - 1) arr = node.children || [];
    }
    return node;
  }

  function updateSectionByPath(sections: ProjectSection[], path: number[], data: Partial<ProjectSection>): ProjectSection[] {
    if (path.length === 0) return sections;
    const idx = path[0];
    if (path.length === 1) {
      return sections.map((s, i) => i === idx ? { ...s, ...data } : s);
    }
    return sections.map((s, i) =>
      i === idx ? { ...s, children: updateSectionByPath(s.children || [], path.slice(1), data) } : s
    );
  }

  function deleteSectionByPath(sections: ProjectSection[], path: number[]): ProjectSection[] {
    if (path.length === 0) return sections;
    const idx = path[0];
    if (path.length === 1) {
      return sections.filter((_, i) => i !== idx);
    }
    return sections.map((s, i) =>
      i === idx ? { ...s, children: deleteSectionByPath(s.children || [], path.slice(1)) } : s
    );
  }

  function addSubSectionByPath(sections: ProjectSection[], path: number[], depth: number, newSectionCount: number): { sections: ProjectSection[]; nextCount: number; newChildIdx: number } {
    if (path.length === 0) return { sections, nextCount: newSectionCount, newChildIdx: 0 };
    const idx = path[0];
    if (path.length === 1) {
      const children = sections[idx].children || [];
      const newChildIdx = children.length;
      const nextCount = newSectionCount + 1;
      const newChildren = [...children, { name: `New Section ${newSectionCount}`, children: [] }];
      return {
        sections: sections.map((s, i) => i === idx ? { ...s, children: newChildren } : s),
        nextCount,
        newChildIdx,
      };
    }
    const result = addSubSectionByPath(sections[idx].children || [], path.slice(1), depth - 1, newSectionCount);
    return {
      sections: sections.map((s, i) => i === idx ? { ...s, children: result.sections } : s),
      nextCount: result.nextCount,
      newChildIdx: result.newChildIdx,
    };
  }

  // Drag gesture logic
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startY: number }) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Free scrolling in both directions
      translateY.value = ctx.startY + event.translationY;
      
      // Prevent dragging above fully open position
      if (translateY.value < 0) {
        translateY.value = 0;
      }
    },
    onEnd: (event) => {
      // Only close if dragged down significantly AND has downward velocity
      if (translateY.value > 200 && event.velocityY > 500) {
        runOnJS(onClose)();
      }
      // No snapping - stays wherever user releases
    }
  });

  const [isMounted, setIsMounted] = React.useState(false);
  const closeTimeout = React.useRef<number | null>(null);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 500 });
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      setIsMounted(true);
      overlayOpacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
    } else if (isMounted) {
      translateY.value = withTiming(height, { duration: 380, easing: Easing.out(Easing.cubic) });
      overlayOpacity.value = withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) });
      closeTimeout.current = setTimeout(() => setIsMounted(false), 450) as unknown as number;
    }
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, [isOpen]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    zIndex: isOpen ? 1 : -1,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isMounted) return null;

  return (
    <React.Fragment>
      <Animated.View
        style={[
          styles.overlay,
          overlayStyle,
          { zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <PanGestureHandler onGestureEvent={gestureHandler} enabled={isMounted}>
        <Animated.View
          style={[
            styles.sheet,
            sheetStyle,
            { backgroundColor: colors.surface, borderColor: colors.border, zIndex: 2, position: 'absolute', left: 0, right: 0, bottom: 0 }
          ]}
        >
          <Text style={[styles.title, { color: colors.primary }]}>Report Structure</Text>
          <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
            {/* Report Details Section */}
            <Pressable style={styles.sectionRow} onPress={() => alert('Report Details Clicked')}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Report Details</Text>
            </Pressable>

            {/* Standard Pages */}
            {[{ name: 'Certificate', component: 'CertificatePage' },
            { name: 'Cover Page', component: 'CoverPage' },
            { name: 'Abstract', component: 'AbstractPage' },
            { name: 'Acknowledgment', component: 'AcknowledgmentPage' },
            { name: 'Declaration', component: 'DeclarationPage' },
            { name: 'Index', component: 'IndexPage' },
            { name: 'List of Abbreviations', component: 'AbbreviationsPage' },
            { name: 'List of Figures', component: 'FiguresPage' },
            { name: 'List of Tables', component: 'TablesPage' }
          ].map((item) => (
            <Pressable 
              key={item.name} 
              style={styles.row} 
              onPress={() => {
                onClose();
                router.push({
                  pathname: '/report/[page]',
                  params: { page: item.component as string }
                });
              }}
            >
              <Text style={[styles.rowText, { color: colors.text }]}>{item.name}</Text>
            </Pressable>
          ))}
            
            {/* Project Sections */}
            <View style={[styles.richHeader, { backgroundColor: colors.surface, borderColor: colors.primary + '33', marginTop: 18 }]}> 
              <View style={[styles.headerAccent, { backgroundColor: colors.primary }]} />
              <Text style={[styles.richHeaderText, { color: colors.primary }]}>Project Sections</Text>
            </View>
            {sections.map((section, idx) => (
              <SectionRow
                key={idx}
                section={section}
                idxPath={[idx]}
                numbering={`${idx + 1}`}
                depth={1}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddSubSection={handleAddSubSection}
                editingIdx={editingIdx}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                handleChangeTitle={handleChangeTitle}
                handleSaveTitle={handleSaveTitle}
                colors={colors}
              />
            ))}
            {/* Add new custom section */}
            <Pressable style={styles.addSectionRow} onPress={handleAddSection}>
              <Text style={[styles.addSectionText, { color: colors.primary }]}>Add Section</Text>
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 22, marginLeft: 6 }}>+</Text>
            </Pressable>
            {/* Close button at the end for accessibility */}
            <Pressable style={[styles.button, { backgroundColor: colors.primary, marginTop: 24, marginBottom: 16 }]} onPress={onClose}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>
    </React.Fragment>
  );
}

interface SectionRowProps {
  section: ProjectSection;
  idxPath: number[];
  numbering: string;
  depth: number;
  onEdit: (idxPath: number[]) => void;
  onDelete: (idxPath: number[]) => void;
  onAddSubSection: (idxPath: number[], depth: number) => void;
  editingIdx: string | null;
  editTitle: string;
  setEditTitle: (t: string) => void;
  handleChangeTitle: (t: string) => void;
  handleSaveTitle: (idxPath: number[]) => void;
  colors: any;
}

const SectionRow: React.FC<SectionRowProps> = ({
  section,
  idxPath,
  numbering,
  depth,
  onEdit,
  onDelete,
  onAddSubSection,
  editingIdx,
  editTitle,
  setEditTitle,
  handleChangeTitle,
  handleSaveTitle,
  colors,
}) => {
  const isEditing = editingIdx === idxPath.join('-');
  const router = useRouter();

  // Helper: determine which section page to navigate to
  const getSectionPage = () => {
    if (depth === 1) return 'SectionL1Page';
    if (depth === 2) return 'SectionL2Page';
    if (depth === 3) return 'SectionL3Page';
    return 'SectionL1Page';
  };

  // Helper: build params for navigation
  const getSectionParams = () => {
    if (depth === 1) {
      return { chapterNumber: idxPath[0] + 1, title: section.name, content: section.name };
    } else if (depth === 2) {
      return {
        chapterNumber: idxPath[0] + 1,
        sectionNumber: idxPath[1] + 1,
        title: section.name,
        content: section.name
      };
    } else if (depth === 3) {
      return {
        chapterNumber: idxPath[0] + 1,
        sectionNumber: idxPath[1] + 1,
        subsectionNumber: idxPath[2] + 1,
        title: section.name,
        content: section.name
      };
    }
    return {};
  };

  // Handler: navigate to section page if not editing
  const handleNavigate = () => {
    if (!isEditing) {
      router.push({
        pathname: '/report/[page]',
        params: {
          page: getSectionPage(),
          ...getSectionParams(),
        },
      });
    }
  };

  return (
    <>
      <View style={[styles.projectSectionRow, { paddingLeft: (depth - 1) * 20 }]}> 
        <Text style={{ width: 36, color: colors.text, fontWeight: 'bold', fontSize: 15 }}>{numbering}</Text>
        {isEditing ? (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              value={editTitle}
              onChangeText={handleChangeTitle}
              style={{
                flex: 1,
                borderBottomWidth: 1,
                borderColor: colors.primary,
                color: colors.text,
                fontSize: 16,
                backgroundColor: colors.surface,
                paddingVertical: 2,
              }}
              autoFocus
              onSubmitEditing={() => handleSaveTitle(idxPath)}
              onBlur={() => handleSaveTitle(idxPath)}
              placeholder="Section Title"
              placeholderTextColor={colors.text + '99'}
            />
            <Pressable onPress={() => handleSaveTitle(idxPath)} style={styles.iconBtn}>
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 18 }}>✔</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={{ flex: 1 }} onPress={handleNavigate}>
            <Text style={[styles.rowText, { color: colors.text }]}>{section.name}</Text>
          </Pressable>
        )}
        <Pressable onPress={() => onEdit(idxPath)} style={styles.iconBtn}><Pencil size={18} color={colors.primary} /></Pressable>
        <Pressable onPress={() => onDelete(idxPath)} style={styles.iconBtn}><Text style={{ color: 'red', fontWeight: 'bold', fontSize: 18 }}>×</Text></Pressable>
        {depth < 3 && (
          <Pressable onPress={() => onAddSubSection(idxPath, depth)} style={styles.iconBtn}>
            <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 22 }}>+</Text>
          </Pressable>
        )}
      </View>
      {/* Render children recursively */}
      {section.children && section.children.map((child, childIdx) => (
        <SectionRow
          key={childIdx}
          section={child}
          idxPath={[...idxPath, childIdx]}
          numbering={numbering + '.' + (childIdx + 1)}
          depth={depth + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubSection={onAddSubSection}
          editingIdx={editingIdx}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          handleChangeTitle={handleChangeTitle}
          handleSaveTitle={handleSaveTitle}
          colors={colors}
        />
      ))}
    </>
  );
};
