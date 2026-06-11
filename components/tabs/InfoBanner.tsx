import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface InfoBannerProps {
  colors: {
    primaryLight: string;
    greenLight: string;
    dangerLight: string;
    primary: string;
    green: string;
    danger: string;
  };
  tone: 'info' | 'success' | 'error';
  text: string;
}

export default function InfoBanner({ colors, tone, text }: InfoBannerProps) {
  const isSuccess = tone === 'success';
  const isError = tone === 'error';

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 12,
        backgroundColor: isSuccess ? colors.greenLight : isError ? colors.dangerLight : colors.primaryLight,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Ionicons
        name={isSuccess ? 'checkmark-circle' : isError ? 'alert-circle' : 'car-outline'}
        size={18}
        color={isSuccess ? colors.green : isError ? colors.danger : colors.primary}
      />
      <Text
        style={{
          fontSize: 12,
          color: isSuccess ? colors.green : isError ? colors.danger : colors.primary,
          fontWeight: isSuccess ? '600' : '500',
          flex: 1,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
