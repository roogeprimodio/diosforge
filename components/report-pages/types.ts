export interface BasePageProps {
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
  onToggleEdit?: () => void;
  onOpenBottomSheet?: () => void;
}

export interface CertificatePageProps extends BasePageProps {
  // Certificate specific props
}

export interface AcknowledgmentPageProps extends BasePageProps {
  studentName?: string;
  acknowledgmentText?: string;
  regards?: string;
}