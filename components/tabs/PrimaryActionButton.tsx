import { Text, TouchableOpacity, View } from 'react-native';

interface PrimaryActionButtonProps {
  label: string;
  onPress: () => void;
  rightLabel?: string;
  colors: {
    primary: string;
  };
}

export default function PrimaryActionButton({
  label,
  onPress,
  rightLabel,
  colors,
}: PrimaryActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
      }}
      activeOpacity={0.85}
    >
      <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>
        {label}
      </Text>
      {rightLabel && (
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 }}>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>{rightLabel}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

