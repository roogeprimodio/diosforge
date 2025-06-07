export interface Project {
  id: string;
  title: string;
  studentName: string;
  studentId: string;
  department: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add any other project properties needed
}

export interface BasePageProps {
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
  onToggleEdit?: () => void;
  onOpenBottomSheet?: (sheetType?: string) => void;
}
