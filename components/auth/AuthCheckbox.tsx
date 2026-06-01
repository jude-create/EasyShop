import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AuthCheckboxProps {
  checked: boolean;
  onPress: () => void;
  colors: {
    danger: string;
    primary: string;
    borderStrong: string;
    textSecondary: string;
  };
  error?: string;
  children: ReactNode;
}

export default function AuthCheckbox({
  checked,
  onPress,
  colors,
  error,
  children,
}: AuthCheckboxProps) {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 16 }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            borderWidth: 1.5,
            borderColor: error ? colors.danger : checked ? colors.primary : colors.borderStrong,
            backgroundColor: checked ? colors.primary : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 1,
          }}
        >
          {checked && <Ionicons name="checkmark" size={13} color="white" />}
        </View>
        <Text style={{ flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 }}>
          {children}
        </Text>
      </TouchableOpacity>

      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}>
          <Ionicons name="alert-circle-outline" size={13} color={colors.danger} />
          <Text style={{ fontSize: 12, color: colors.danger }}>{error}</Text>
        </View>
      ) : null}
    </>
  );
}

