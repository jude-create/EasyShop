import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ReviewAddressLine from './ReviewAddressLine';

interface AddressState {
  name: string;
  street: string;
  city: string;
  state: string;
}

interface ReviewAddressCardProps {
  colors: {
    card: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
  address: AddressState;
}

export default function ReviewAddressCard({
  colors,
  address,
}: ReviewAddressCardProps) {
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 14, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Ionicons name="location-outline" size={16} color={colors.primary} />
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>Delivery Address</Text>
      </View>
      <ReviewAddressLine colors={colors}>
        {`${address.name || 'John Doe'}\n${address.street || '12 Adeola Odeku Street'}\n${address.city || 'Lagos'}, ${address.state || 'Lagos State'}`}
      </ReviewAddressLine>
    </View>
  );
}
