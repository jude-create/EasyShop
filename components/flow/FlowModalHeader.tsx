import { Text, TouchableOpacity, View } from 'react-native';

interface FlowModalHeaderProps {
  colors: {
    card: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
  title: string;
  leftLabel?: string;
  rightLabel?: string;
  onLeftPress: () => void;
  onRightPress: () => void;
}

export default function FlowModalHeader({
  colors,
  title,
  leftLabel = 'Cancel',
  rightLabel = 'Save',
  onLeftPress,
  onRightPress,
}: FlowModalHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: colors.card,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
      }}
    >
      <TouchableOpacity onPress={onLeftPress}>
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>{leftLabel}</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>{title}</Text>
      <TouchableOpacity onPress={onRightPress}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>{rightLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

