import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FlowTextField from './FlowTextField';
import FlowOptionRow from './FlowOptionRow';
import { formatPrice } from '../../constants/products';

export type PayMethod = 'card' | 'transfer' | 'cash';

interface CardState {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

interface CheckoutPaymentStepProps {
  colors: {
    card: string;
    border: string;
    primary: string;
    primaryLight: string;
    subtle: string;
    greenLight: string;
    green: string;
    text: string;
    textMuted: string;
    textSecondary: string;
  };
  total: number;
  payMethod: PayMethod;
  onPayMethodChange: (method: PayMethod) => void;
  card: CardState;
  onCardChange: (next: CardState) => void;
}

const OPTIONS: { key: PayMethod; icon: keyof typeof Ionicons.glyphMap; label: string; description: string }[] = [
  { key: 'card', icon: 'card-outline', label: 'Debit / Credit Card', description: 'Visa, Mastercard, Verve' },
  { key: 'transfer', icon: 'swap-horizontal-outline', label: 'Bank Transfer', description: 'Pay via bank transfer' },
  { key: 'cash', icon: 'cash-outline', label: 'Pay on Delivery', description: 'Cash on delivery' },
];

export default function CheckoutPaymentStep({
  colors,
  total,
  payMethod,
  onPayMethodChange,
  card,
  onCardChange,
}: CheckoutPaymentStepProps) {
  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16, letterSpacing: -0.3 }}>
        Payment Method
      </Text>

      <View style={{ gap: 10, marginBottom: 20 }}>
        {OPTIONS.map((option) => (
          <FlowOptionRow
            key={option.key}
            colors={colors}
            icon={option.icon}
            label={option.label}
            description={option.description}
            selected={payMethod === option.key}
            onPress={() => onPayMethodChange(option.key)}
          />
        ))}
      </View>

      {payMethod === 'card' && (
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: colors.border }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 14 }}>
            Card Details
          </Text>
          <View style={{ gap: 14 }}>
            <FlowTextField
              colors={colors}
              label="Card Number"
              value={card.number}
              placeholder="0000 0000 0000 0000"
              keyboardType="number-pad"
              maxLength={19}
              onChangeText={(number) => onCardChange({ ...card, number: formatCard(number) })}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <FlowTextField
                  colors={colors}
                  label="Expiry"
                  value={card.expiry}
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  maxLength={5}
                  onChangeText={(expiry) => onCardChange({ ...card, expiry: formatExpiry(expiry) })}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FlowTextField
                  colors={colors}
                  label="CVV"
                  value={card.cvv}
                  placeholder="•••"
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={3}
                  onChangeText={(cvv) => onCardChange({ ...card, cvv: cvv.replace(/\D/g, '').slice(0, 3) })}
                />
              </View>
            </View>
            <FlowTextField
              colors={colors}
              label="Cardholder Name"
              value={card.name}
              placeholder="JOHN DOE"
              onChangeText={(name) => onCardChange({ ...card, name })}
            />
          </View>
        </View>
      )}

      {payMethod === 'transfer' && (
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: colors.border, gap: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
            Transfer Details
          </Text>
          {[
            ['Bank', 'Wema Bank'],
            ['Account Number', '0123456789'],
            ['Account Name', 'CW RETAIL LTD'],
            ['Amount', formatPrice(total)],
          ].map(([label, value]) => (
            <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>{label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{value}</Text>
            </View>
          ))}
        </View>
      )}

      {payMethod === 'cash' && (
        <View style={{ backgroundColor: colors.greenLight, borderRadius: 14, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Ionicons name="information-circle-outline" size={20} color={colors.green} />
          <Text style={{ fontSize: 13, color: colors.green, flex: 1, lineHeight: 18 }}>
            Please have the exact amount ready. Our delivery agent will collect payment upon arrival.
          </Text>
        </View>
      )}
    </View>
  );
}
