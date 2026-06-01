import { ReactNode } from 'react';
import { View } from 'react-native';

interface FlowSectionProps {
  children: ReactNode;
  padding?: number;
}

export default function FlowSection({ children, padding = 16 }: FlowSectionProps) {
  return <View style={{ padding, gap: 12 }}>{children}</View>;
}

