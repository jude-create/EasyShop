import { KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import FlowScreenHeader from '../../components/flow/FlowScreenHeader';
import FlowPaymentCard from '../../components/flow/FlowPaymentCard';
import FlowMethodRow from '../../components/flow/FlowMethodRow';
import FlowModalHeader from '../../components/flow/FlowModalHeader';
import FlowTextField from '../../components/flow/FlowTextField';

interface Card {
  id: string;
  last4: string;
  brand: string;
  expiry: string;
  name: string;
  isDefault: boolean;
}

const INITIAL: Card[] = [
  { id: '1', last4: '4242', brand: 'Visa', expiry: '12/26', name: 'ADMIN USER', isDefault: true },
  { id: '2', last4: '5353', brand: 'Mastercard', expiry: '09/25', name: 'ADMIN USER', isDefault: false },
];

const OTHER_METHODS = [
  { icon: 'swap-horizontal-outline' as const, label: 'Bank Transfer', desc: 'Pay directly from your bank' },
  { icon: 'cash-outline' as const, label: 'Pay on Delivery', desc: 'Cash when your order arrives' },
];

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [cards, setCards] = useState<Card[]>(INITIAL);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const formatCard = (value: string) =>
    value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const detectBrand = (number: string) => {
    const digits = number.replace(/\s/g, '');
    if (digits.startsWith('4')) return 'Visa';
    if (digits.startsWith('5')) return 'Mastercard';
    return 'Verve';
  };

  const handleAdd = () => {
    const digits = form.number.replace(/\s/g, '');
    const newCard: Card = {
      id: Date.now().toString(),
      last4: digits.slice(-4) || '0000',
      brand: detectBrand(digits),
      expiry: form.expiry || 'MM/YY',
      name: form.name.toUpperCase() || 'CARDHOLDER',
      isDefault: cards.length === 0,
    };

    setCards((prev) => [...prev, newCard]);
    setModalOpen(false);
    setForm({ number: '', expiry: '', cvv: '', name: '' });
  };

  const setDefault = (id: string) => setCards((prev) => prev.map((card) => ({ ...card, isDefault: card.id === id })));

  const handleDelete = (id: string) => {
    Alert.alert('Remove Card', 'Remove this card from your account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setCards((prev) => prev.filter((card) => card.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <FlowScreenHeader
        colors={colors}
        title="Payment Methods"
        onBack={() => router.back()}
        onRightPress={() => setModalOpen(true)}
        rightIcon="add-circle-outline"
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12 }}>
          {cards.map((card) => (
            <FlowPaymentCard
              key={card.id}
              colors={colors}
              brand={card.brand}
              last4={card.last4}
              expiry={card.expiry}
              name={card.name}
              isDefault={card.isDefault}
              onSetDefault={() => setDefault(card.id)}
              onRemove={() => handleDelete(card.id)}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setModalOpen(true)}
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
            marginTop: 12,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 20, color: colors.primary }}>+</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}>Add New Card</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 24, marginBottom: 10 }}>
          Other Methods
        </Text>
        {OTHER_METHODS.map((method) => (
          <FlowMethodRow
            key={method.label}
            colors={colors}
            icon={method.icon}
            label={method.label}
            description={method.desc}
          />
        ))}
      </ScrollView>

      <Modal visible={modalOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalOpen(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <FlowModalHeader
              colors={colors}
              title="Add Card"
              onLeftPress={() => setModalOpen(false)}
              onRightPress={handleAdd}
              leftLabel="Cancel"
              rightLabel="Add"
            />

            <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }} keyboardShouldPersistTaps="handled">
              <View style={{ backgroundColor: detectBrand(form.number) === 'Visa' ? '#1A1F71' : detectBrand(form.number) === 'Mastercard' ? '#EB001B' : '#007A5E', borderRadius: 16, padding: 22, marginBottom: 8 }}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 10 }}>
                  CARD NUMBER
                </Text>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', letterSpacing: 2 }}>
                  {form.number || '•••• •••• •••• ••••'}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>CARDHOLDER</Text>
                    <Text style={{ color: 'white', fontSize: 13, fontWeight: '600', marginTop: 2 }}>
                      {form.name.toUpperCase() || 'YOUR NAME'}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>EXPIRES</Text>
                    <Text style={{ color: 'white', fontSize: 13, fontWeight: '600', marginTop: 2 }}>
                      {form.expiry || 'MM/YY'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ gap: 14 }}>
                <FlowTextField
                  colors={colors}
                  label="Card Number"
                  value={form.number}
                  placeholder="0000 0000 0000 0000"
                  keyboardType="number-pad"
                  maxLength={19}
                  onChangeText={(number) => setForm((prev) => ({ ...prev, number: formatCard(number) }))}
                />
                <FlowTextField
                  colors={colors}
                  label="Cardholder Name"
                  value={form.name}
                  placeholder="JOHN DOE"
                  maxLength={30}
                  onChangeText={(name) => setForm((prev) => ({ ...prev, name: name.toUpperCase() }))}
                />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <FlowTextField
                      colors={colors}
                      label="Expiry Date"
                      value={form.expiry}
                      placeholder="MM/YY"
                      keyboardType="number-pad"
                      maxLength={5}
                      onChangeText={(expiry) => setForm((prev) => ({ ...prev, expiry: formatExpiry(expiry) }))}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <FlowTextField
                      colors={colors}
                      label="CVV"
                      value={form.cvv}
                      placeholder="•••"
                      keyboardType="number-pad"
                      secureTextEntry
                      maxLength={3}
                      onChangeText={(cvv) => setForm((prev) => ({ ...prev, cvv: cvv.replace(/\D/g, '').slice(0, 3) }))}
                    />
                  </View>
                </View>
              </View>

              <View style={{ backgroundColor: colors.subtle, borderRadius: 12, padding: 12, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <Text style={{ fontSize: 16 }}>🔒</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, flex: 1 }}>
                  Your card details are encrypted and secure
                </Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
