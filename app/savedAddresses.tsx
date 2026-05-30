import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from './context/ThemeContext';
import FlowScreenHeader from './components/flow/FlowScreenHeader';
import FlowAddressCard, { Address } from './components/flow/FlowAddressCard';
import FlowModalHeader from './components/flow/FlowModalHeader';
import FlowTextField from './components/flow/FlowTextField';
import FlowLabelChips from './components/flow/FlowLabelChips';

const INITIAL: Address[] = [
  { id: '1', label: 'Home', name: 'Admin User', street: '12 Adeola Odeku Street', city: 'Victoria Island', state: 'Lagos', phone: '+234 800 000 0000', isDefault: true },
  { id: '2', label: 'Office', name: 'Admin User', street: '5 Broad Street', city: 'Lagos Island', state: 'Lagos', phone: '+234 801 000 0000', isDefault: false },
];

const BLANK: Address = { id: '', label: '', name: '', street: '', city: '', state: '', phone: '', isDefault: false };

const LABEL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Office: 'briefcase-outline',
  Other: 'location-outline',
};

export default function SavedAddressesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [addresses, setAddresses] = useState<Address[]>(INITIAL);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address>(BLANK);

  const openNew = () => {
    setEditing({ ...BLANK, id: Date.now().toString(), label: 'Home' });
    setModalOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setModalOpen(true);
  };

  const handleSave = () => {
    setAddresses((prev) => {
      const exists = prev.find((address) => address.id === editing.id);
      if (exists) return prev.map((address) => (address.id === editing.id ? editing : address));
      return [...prev, editing];
    });
    setModalOpen(false);
  };

  const setDefault = (id: string) =>
    setAddresses((prev) => prev.map((address) => ({ ...address, isDefault: address.id === id })));

  const handleDelete = (id: string) => {
    Alert.alert('Delete Address', 'Remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setAddresses((prev) => prev.filter((address) => address.id !== id)) },
    ]);
  };

  const fields: { key: keyof Address; label: string; placeholder: string }[] = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
    { key: 'phone', label: 'Phone', placeholder: '+234 800 000 0000' },
    { key: 'street', label: 'Street Address', placeholder: '12 Adeola Odeku Street' },
    { key: 'city', label: 'City', placeholder: 'Lagos' },
    { key: 'state', label: 'State', placeholder: 'Lagos State' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <FlowScreenHeader
        colors={colors}
        title="Saved Addresses"
        onBack={() => router.back()}
        onRightPress={openNew}
        rightIcon="add-circle-outline"
      />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {addresses.map((address) => (
          <FlowAddressCard
            key={address.id}
            colors={colors}
            address={address}
            icon={LABEL_ICONS[address.label] || 'location-outline'}
            onEdit={() => openEdit(address)}
            onDelete={() => handleDelete(address.id)}
            onSetDefault={address.isDefault ? undefined : () => setDefault(address.id)}
          />
        ))}

        <TouchableOpacity
          onPress={openNew}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: colors.card,
            borderRadius: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: colors.borderStrong,
            marginTop: 4,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 20, color: colors.primary }}>+</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalOpen(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <FlowModalHeader
              colors={colors}
              title={addresses.find((address) => address.id === editing.id) ? 'Edit Address' : 'New Address'}
              onLeftPress={() => setModalOpen(false)}
              onRightPress={handleSave}
            />

            <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 2 }}>
                Label
              </Text>
              <FlowLabelChips
                colors={colors}
                labels={['Home', 'Office', 'Other']}
                value={editing.label}
                onChange={(label) => setEditing({ ...editing, label })}
                icons={LABEL_ICONS}
              />

              {fields.map((field) => (
                <FlowTextField
                  key={field.key}
                  colors={colors}
                  label={field.label}
                  value={String(editing[field.key] ?? '')}
                  placeholder={field.placeholder}
                  onChangeText={(value) => setEditing({ ...editing, [field.key]: value })}
                />
              ))}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
