import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface AuthScreenProps {
  children: ReactNode;
  backgroundColor: string;
  contentBackgroundColor: string;
}

export default function AuthScreen({
  children,
  backgroundColor,
  contentBackgroundColor,
}: AuthScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top']}>
      <View style={{ flex: 1, backgroundColor: contentBackgroundColor }}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

