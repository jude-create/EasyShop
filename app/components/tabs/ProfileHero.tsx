import { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ProfileHeroProps {
  colors: {
    primary: string;
  };
  name: string;
  email: string;
  role: string;
}

export default function ProfileHero({ colors, name, email, role }: ProfileHeroProps) {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handlePickImage = () => {
    Alert.alert('Change Photo', 'Choose how to update your profile photo', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera access is required to take a photo.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets[0]) {
            setAvatarUri(result.assets[0].uri);
          }
        },
      },
      {
        text: 'Choose from Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Photo library access is required.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets[0]) {
            setAvatarUri(result.assets[0].uri);
          }
        },
      },
      {
        text: 'Remove Photo',
        style: 'destructive',
        onPress: () => setAvatarUri(null),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={{ backgroundColor: colors.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: 'white', letterSpacing: -0.5, marginBottom: 20 }}>
        Profile
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>

        {/* Avatar with camera overlay */}
        <TouchableOpacity onPress={handlePickImage} activeOpacity={0.85} style={{ position: 'relative' }}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={{ width: 72, height: 72, borderRadius: 22, borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.4)' }}
            />
          ) : (
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.3)',
                borderStyle: 'dashed',
              }}
            >
              <Ionicons name="person" size={32} color="white" />
            </View>
          )}

          {/* Camera badge */}
          <View
            style={{
              position: 'absolute',
              bottom: -3,
              right: -3,
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 3,
            }}
          >
            <Ionicons name="camera" size={13} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', letterSpacing: -0.3 }}>
            {name}
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
            {email}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>{role}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tap hint if no photo set */}
      {!avatarUri && (
        <TouchableOpacity onPress={handlePickImage} style={{ marginTop: 10, alignSelf: 'flex-start', marginLeft: 0 }}>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginLeft: 2 }}>
            Tap photo to add picture
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}