import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface InfoBannerProps {
  colors: {
    primaryLight: string;
    greenLight: string;
    primary: string;
    green: string;
  };
  tone: 'info' | 'success';
  text: string;
}

export default function InfoBanner({ colors, tone, text }: InfoBannerProps) {
  const isSuccess = tone === 'success';

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 12,
        backgroundColor: isSuccess ? colors.greenLight : colors.primaryLight,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Ionicons
        name={isSuccess ? 'checkmark-circle' : 'car-outline'}
        size={18}
        color={isSuccess ? colors.green : colors.primary}
      />
      <Text
        style={{
          fontSize: 12,
          color: isSuccess ? colors.green : colors.primary,
          fontWeight: isSuccess ? '600' : '500',
          flex: 1,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

