import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function PaymentCallbackScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <ActivityIndicator color={colors.primary} />
      <View style={{ height: 14 }} />
      <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700', textAlign: 'center' }}>
        Returning to checkout
      </Text>
      <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 }}>
        Please wait while the app verifies your payment.
      </Text>
    </SafeAreaView>
  );
}
