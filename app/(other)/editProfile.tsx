import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import {
  ProfileScreenHeader,
  ProfileAvatarPicker,
  ProfileSectionTitle,
  ProfileInputField,
  ProfileSaveButton,
} from '../../components/profile';

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  dob: string;
};

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [saving, setSaving] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@cwretail.com',
    phone: '+234 800 000 0000',
    bio: 'Store Manager at CW Retail',
    dob: '',
  });

  const updateField = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePickImage = () => {
    Alert.alert('Change Profile Photo', 'Choose how to update your photo', [
      {
        text: '📷  Take Photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera access is needed to take a photo. Please enable it in your device settings.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
          });
          if (!result.canceled && result.assets[0]) setAvatarUri(result.assets[0].uri);
        },
      },
      {
        text: '🖼️  Choose from Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Required', 'Photo library access is needed. Please enable it in your device settings.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
          });
          if (!result.canceled && result.assets[0]) setAvatarUri(result.assets[0].uri);
        },
      },
      ...(avatarUri
        ? [{ text: '🗑️  Remove Photo', style: 'destructive' as const, onPress: () => setAvatarUri(null) }]
        : []),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSaving(false);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ProfileScreenHeader
          colors={colors}
          title="Edit Profile"
          onBack={() => router.back()}
          onSave={handleSave}
          saving={saving}
        />

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <ProfileAvatarPicker
            colors={colors}
            avatarUri={avatarUri}
            onPick={handlePickImage}
            onRemove={() => setAvatarUri(null)}
          />

          <ProfileSectionTitle colors={colors} title="Personal Info" />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <ProfileInputField
                colors={colors}
                label="First Name"
                value={form.firstName}
                onChangeText={(value) => updateField('firstName', value)}
                placeholder="John"
              />
            </View>
            <View style={{ flex: 1 }}>
              <ProfileInputField
                colors={colors}
                label="Last Name"
                value={form.lastName}
                onChangeText={(value) => updateField('lastName', value)}
                placeholder="Doe"
              />
            </View>
          </View>
          <ProfileInputField
            colors={colors}
            label="Bio"
            value={form.bio}
            onChangeText={(value) => updateField('bio', value)}
            placeholder="Tell us about yourself"
            multiline
          />
          <ProfileInputField
            colors={colors}
            label="Date of Birth"
            value={form.dob}
            onChangeText={(value) => updateField('dob', value)}
            placeholder="DD / MM / YYYY"
          />

          <ProfileSectionTitle colors={colors} title="Contact Info" />
          <ProfileInputField
            colors={colors}
            label="Email Address"
            value={form.email}
            onChangeText={(value) => updateField('email', value)}
            placeholder="you@example.com"
            keyboardType="email-address"
          />
          <ProfileInputField
            colors={colors}
            label="Phone Number"
            value={form.phone}
            onChangeText={(value) => updateField('phone', value)}
            placeholder="+234 800 000 0000"
            keyboardType="phone-pad"
          />

          <ProfileSaveButton colors={colors} label="Save Changes" loading={saving} onPress={handleSave} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
