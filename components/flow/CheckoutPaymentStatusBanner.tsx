import { Text, View } from 'react-native';
import type { AppColors } from '../../context/ThemeContext';
import type { PaymentFeedback } from '../../lib/paystackCheckout';

interface CheckoutPaymentStatusBannerProps {
  colors: AppColors;
  feedback: PaymentFeedback;
}

function getTitle(status: PaymentFeedback['status']) {
  if (status === 'success') return 'Payment verified';
  if (status === 'failed') return 'Payment failed';
  if (status === 'cancelled') return 'Payment cancelled';
  return 'Payment in progress';
}

function getStatusColor(colors: AppColors, status: PaymentFeedback['status']) {
  if (status === 'success') return colors.green;
  if (status === 'failed' || status === 'cancelled') return '#D92D20';
  return colors.primary;
}

export default function CheckoutPaymentStatusBanner({
  colors,
  feedback,
}: CheckoutPaymentStatusBannerProps) {
  if (feedback.status === 'idle') return null;

  const statusColor = getStatusColor(colors, feedback.status);

  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: statusColor }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: statusColor, marginBottom: 4 }}>
        {getTitle(feedback.status)}
      </Text>
      <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
        {feedback.message}
      </Text>
    </View>
  );
}
