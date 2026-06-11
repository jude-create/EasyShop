import { ReactNode } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface AuthScreenProps {
  children: ReactNode;
  backgroundColor: string;
  contentBackgroundColor: string;
  loading?: boolean;
  loadingLabel?: string;
}

export default function AuthScreen({
  children,
  backgroundColor,
  contentBackgroundColor,
  loading = false,
  loadingLabel = 'Signing you in...',
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

        {loading && (
          <View
            pointerEvents="auto"
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0, 0, 0, 0.62)',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
            
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(18, 18, 18, 0.96)',
                borderRadius: 20,
                paddingVertical: 22,
                paddingHorizontal: 26,
                alignItems: 'center',
                minWidth: 180,
              }}
            >
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text
                style={{
                  marginTop: 14,
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: '700',
                  textAlign: 'center',
                }}
              >
                {loadingLabel}
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
