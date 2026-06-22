import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { AppColors } from '../../context/ThemeContext';
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
  colors: AppColors;
  total: number;
  payMethod: PayMethod;
  onPayMethodChange: (method: PayMethod) => void;
  card: CardState;
  onCardChange: (next: CardState) => void;
}

const OPTIONS: { key: PayMethod; icon: keyof typeof Ionicons.glyphMap; label: string; description: string }[] = [
  { key: 'card', icon: 'card-outline', label: 'Debit / Credit Card', description: 'Secure Paystack test checkout' },
  { key: 'transfer', icon: 'swap-horizontal-outline', label: 'Bank Transfer', description: 'Pay via bank transfer' },
  { key: 'cash', icon: 'cash-outline', label: 'Pay on Delivery', description: 'Cash on delivery' },
];

export default function CheckoutPaymentStep({
  colors,
  total,
  payMethod,
  onPayMethodChange,
}: CheckoutPaymentStepProps) {
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
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: colors.border, gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
              Secure Paystack Test Checkout
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 19 }}>
            Your order is created only after Paystack verifies a successful transaction.
          </Text>
          <View style={{ backgroundColor: colors.subtle, borderRadius: 12, padding: 12, gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text }}>
              Test amount
            </Text>
            <Text style={{ fontSize: 14, color: colors.text }}>
              {formatPrice(total)}
            </Text>
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
