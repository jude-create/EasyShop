import { Text, TouchableOpacity, View } from 'react-native';

interface TabSectionTitleProps {
  colors: {
    text: string;
    primary: string;
  };
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export default function TabSectionTitle({
  colors,
  title,
  actionLabel,
  onActionPress,
}: TabSectionTitleProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, letterSpacing: -0.3 }}>
        {title}
      </Text>
      {actionLabel && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '500' }}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

