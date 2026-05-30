import { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TabShellProps {
  backgroundColor: string;
  contentBackgroundColor: string;
  children: ReactNode;
}

export default function TabShell({
  backgroundColor,
  contentBackgroundColor,
  children,
}: TabShellProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top']}>
      <View style={{ flex: 1, backgroundColor: contentBackgroundColor }}>
        {children}
      </View>
    </SafeAreaView>
  );
}

