import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FlowTextField from './FlowTextField';
import { formatPrice } from '../../constants/products';

interface AddressState {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
}

interface CheckoutDeliveryStepProps {
  colors: {
    primary: string;
    primaryLight: string;
    subtle: string;
    card: string;
    borderStrong: string;
    text: string;
    textMuted: string;
    textSecondary: string;
  };
  delivery: number;
  address: AddressState;
  onChange: (next: AddressState) => void;
}

export default function CheckoutDeliveryStep({
  colors,
  delivery,
  address,
  onChange,
}: CheckoutDeliveryStepProps) {
  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16, letterSpacing: -0.3 }}>
        Delivery Details
      </Text>
      <View style={{ gap: 14 }}>
        <FlowTextField
          colors={colors}
          label="Full Name"
          value={address.name}
          placeholder="John Doe"
          onChangeText={(name) => onChange({ ...address, name })}
        />
        <FlowTextField
          colors={colors}
          label="Phone Number"
          value={address.phone}
          placeholder="+234 800 000 0000"
          keyboardType="phone-pad"
          onChangeText={(phone) => onChange({ ...address, phone })}
        />
        <FlowTextField
          colors={colors}
          label="Street Address"
          value={address.street}
          placeholder="12 Adeola Odeku Street"
          onChangeText={(street) => onChange({ ...address, street })}
        />
        <FlowTextField
          colors={colors}
          label="City"
          value={address.city}
          placeholder="Lagos"
          onChangeText={(city) => onChange({ ...address, city })}
        />
        <FlowTextField
          colors={colors}
          label="State"
          value={address.state}
          placeholder="Lagos State"
          onChangeText={(state) => onChange({ ...address, state })}
        />
      </View>

      <View style={{ backgroundColor: colors.primaryLight, borderRadius: 12, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 14 }}>
        <Ionicons name="car-outline" size={18} color={colors.primary} />
        <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '500', flex: 1 }}>
          {delivery === 0 ? 'Free delivery on your order 🎉' : `Delivery: ${formatPrice(delivery)}`}
        </Text>
      </View>
    </View>
  );
}

