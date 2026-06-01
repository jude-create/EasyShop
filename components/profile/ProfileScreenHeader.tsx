import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ProfileScreenHeaderProps {
  colors: {
    card: string;
    border: string;
    text: string;
    primary: string;
  };
  title: string;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
}

export default function ProfileScreenHeader({
  colors,
  title,
  onBack,
  onSave,
  saving,
}: ProfileScreenHeaderProps) {
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
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, letterSpacing: -0.3 }}>
        {title}
      </Text>
      <TouchableOpacity onPress={onSave} disabled={saving}>
        {saving ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
