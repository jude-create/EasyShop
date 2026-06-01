import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  isDefault: boolean;
}

interface FlowAddressCardProps {
  colors: {
    card: string;
    border: string;
    primary: string;
    primaryLight: string;
    subtle: string;
    text: string;
    textSecondary: string;
    danger: string;
    borderStrong: string;
  };
  address: Address;
  icon: keyof typeof Ionicons.glyphMap;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault?: () => void;
}

export default function FlowAddressCard({
  colors,
  address,
  icon,
  onEdit,
  onDelete,
  onSetDefault,
}: FlowAddressCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: address.isDefault ? 1.5 : 0.5,
        borderColor: address.isDefault ? colors.primary : colors.border,
        overflow: 'hidden',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: address.isDefault ? colors.primaryLight : colors.subtle,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={icon} size={20} color={address.isDefault ? colors.primary : colors.textSecondary} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{address.label || 'Address'}</Text>
            {address.isDefault && (
              <View style={{ backgroundColor: colors.primaryLight, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 }}>
                <Text style={{ fontSize: 9, fontWeight: '700', color: colors.primary }}>DEFAULT</Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 17 }}>
            {address.street}, {address.city}
            {'\n'}
            {address.state}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: colors.border }}>
        {!address.isDefault && onSetDefault && (
          <TouchableOpacity onPress={onSetDefault} style={{ flex: 1, paddingVertical: 11, alignItems: 'center', borderRightWidth: 0.5, borderRightColor: colors.border }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onEdit} style={{ flex: 1, paddingVertical: 11, alignItems: 'center', borderRightWidth: 0.5, borderRightColor: colors.border }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={{ flex: 1, paddingVertical: 11, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.danger }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

