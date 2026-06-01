import { Text, TouchableOpacity, View } from 'react-native';

interface FlowPaymentCardProps {
  colors: {
    card: string;
    border: string;
    primary: string;
    primaryLight: string;
    subtle: string;
    text: string;
    textMuted: string;
    textSecondary: string;
  };
  brand: string;
  last4: string;
  expiry: string;
  name: string;
  isDefault: boolean;
  onSetDefault: () => void;
  onRemove: () => void;
}

const BRAND_COLORS: Record<string, string> = {
  Visa: '#1A1F71',
  Mastercard: '#EB001B',
  Verve: '#007A5E',
};

export default function FlowPaymentCard({
  colors,
  brand,
  last4,
  expiry,
  name,
  isDefault,
  onSetDefault,
  onRemove,
}: FlowPaymentCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 18,
        borderWidth: isDefault ? 1.5 : 0.5,
        borderColor: isDefault ? colors.primary : colors.border,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          backgroundColor: BRAND_COLORS[brand] || colors.primary,
          padding: 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Card Number
          </Text>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', letterSpacing: 2, marginTop: 4 }}>
            •••• •••• •••• {last4}
          </Text>
        </View>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: -0.5 }}>{brand}</Text>
      </View>

      <View style={{ flexDirection: 'row', padding: 14, gap: 20 }}>
        <View>
          <Text style={{ fontSize: 10, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>
            Cardholder
          </Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginTop: 2 }}>
            {name}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 10, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>
            Expires
          </Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginTop: 2 }}>
            {expiry}
          </Text>
        </View>
        {isDefault && (
          <View style={{ marginLeft: 'auto', backgroundColor: colors.primaryLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.primary }}>DEFAULT</Text>
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: colors.border }}>
        {!isDefault && (
          <TouchableOpacity onPress={onSetDefault} style={{ flex: 1, paddingVertical: 11, alignItems: 'center', borderRightWidth: 0.5, borderRightColor: colors.border }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onRemove} style={{ flex: 1, paddingVertical: 11, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.danger }}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
