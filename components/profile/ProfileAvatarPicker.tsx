import { Image, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ProfileAvatarPickerProps {
  colors: {
    background: string;
    card: string;
    primary: string;
    danger: string;
  };
  avatarUri: string | null;
  onPick: () => void;
  onRemove: () => void;
}

export default function ProfileAvatarPicker({
  colors,
  avatarUri,
  onPick,
  onRemove,
}: ProfileAvatarPickerProps) {
  return (
    <View style={{ alignItems: 'center', marginBottom: 8, marginTop: 8 }}>
      <TouchableOpacity onPress={onPick} activeOpacity={0.85} style={{ position: 'relative' }}>
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={{ width: 96, height: 96, borderRadius: 28, borderWidth: 3, borderColor: colors.primary }}
          />
        ) : (
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 28,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="person" size={44} color="white" />
          </View>
        )}
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.card,
            borderWidth: 2.5,
            borderColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <Ionicons name="camera" size={15} color={colors.primary} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPick} style={{ marginTop: 12 }} activeOpacity={0.7}>
        <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '600' }}>
          {avatarUri ? 'Change Photo' : 'Add Profile Photo'}
        </Text>
      </TouchableOpacity>

      {avatarUri && (
        <TouchableOpacity onPress={onRemove} style={{ marginTop: 4 }} activeOpacity={0.7}>
          <Text style={{ fontSize: 12, color: colors.danger }}>Remove Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

