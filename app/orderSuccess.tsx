import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from './context/ThemeContext';
import { formatPrice } from './constants/products';

const ORDER_NUMBER = `CWR-${Math.floor(100000 + Math.random() * 900000)}`;

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 6 }),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideUp, { toValue: 0, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const DETAILS = [
    { icon: 'receipt-outline' as const,   label: 'Order Number',    value: ORDER_NUMBER },
    { icon: 'time-outline' as const,       label: 'Estimated Delivery', value: '1 – 2 Business Days' },
    { icon: 'car-outline' as const,        label: 'Delivery Method', value: 'Standard Delivery' },
    { icon: 'shield-checkmark-outline' as const, label: 'Payment', value: 'Confirmed ✓' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>

        {/* Success Icon */}
        <Animated.View style={{ transform: [{ scale }], marginBottom: 28 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.greenLight, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="checkmark" size={40} color="white" />
            </View>
          </View>
        </Animated.View>

        {/* Text */}
        <Animated.View style={{ alignItems: 'center', opacity, transform: [{ translateY: slideUp }], width: '100%' }}>
          <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5, marginBottom: 8 }}>
            Order Placed! 🎉
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 21, marginBottom: 28 }}>
            Your order has been confirmed. We'll send you a notification when it's on its way.
          </Text>

          {/* Details Card */}
          <View style={{ width: '100%', backgroundColor: colors.card, borderRadius: 18, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden', marginBottom: 24 }}>
            {DETAILS.map((d, i) => (
              <View
                key={d.label}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderBottomWidth: i < DETAILS.length - 1 ? 0.5 : 0, borderBottomColor: colors.border }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.subtle, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={d.icon} size={18} color={colors.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.3 }}>{d.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 1 }}>{d.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Buttons */}
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/home')}
            style={{ width: '100%', backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 }}
            activeOpacity={0.85}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/products')}
            style={{ width: '100%', backgroundColor: colors.subtle, borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 0.5, borderColor: colors.border }}
            activeOpacity={0.85}
          >
            <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16, letterSpacing: -0.2 }}>Continue Shopping</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
