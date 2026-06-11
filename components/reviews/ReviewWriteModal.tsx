import { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import ReviewStarRow from './ReviewStarRow';
import type { ReviewableProduct } from './reviewTypes';

interface ReviewWriteModalProps {
  visible: boolean;
  colors: {
    background: string;
    card: string;
    border: string;
    borderStrong: string;
    text: string;
    textMuted: string;
    textSecondary: string;
    subtle: string;
    primary: string;
    primaryLight: string;
    danger: string;
  };
  products: ReviewableProduct[];
  selectedProduct: ReviewableProduct;
  rating: number;
  comment: string;
  submitting: boolean;
  ratingError: boolean;
  onClose: () => void;
  onSelectProduct: (product: ReviewableProduct) => void;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: () => void;
}

export default function ReviewWriteModal({
  visible,
  colors,
  products,
  selectedProduct,
  rating,
  comment,
  submitting,
  ratingError,
  onClose,
  onSelectProduct,
  onRatingChange,
  onCommentChange,
  onSubmit,
}: ReviewWriteModalProps) {
  const ratingLabel = useMemo(
    () => (rating === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]),
    [rating],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: colors.card,
              borderBottomWidth: 0.5,
              borderBottomColor: colors.border,
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>
              Write a Review
            </Text>
            <View style={{ width: 22 }} />
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {products.length > 1 && (
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: colors.textSecondary,
                    letterSpacing: 0.4,
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}
                >
                  Product
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {products.map((product) => (
                    <TouchableOpacity
                      key={product.productId}
                      onPress={() => onSelectProduct(product)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 12,
                        backgroundColor:
                          selectedProduct.productId === product.productId
                            ? colors.primaryLight
                            : colors.subtle,
                        borderWidth: 1.5,
                        borderColor:
                          selectedProduct.productId === product.productId
                            ? colors.primary
                            : 'transparent',
                      }}
                      activeOpacity={0.8}
                    >
                      <Image
    source={typeof product.productImage === 'string' ? { uri: product.productImage } : product.productImage}
    style={{ width: 36, height: '100%' }}
    resizeMode="contain"
    />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color:
                            selectedProduct.productId === product.productId
                              ? colors.primary
                              : colors.text,
                        }}
                      >
                        {product.productName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 14,
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                borderWidth: 0.5,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 13,
                  backgroundColor: colors.subtle,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={selectedProduct.productImage}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
                  {selectedProduct.productName}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                  Order {selectedProduct.orderId}
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: colors.textSecondary,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Your Rating <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <View style={{ alignItems: 'center', gap: 8 }}>
                <ReviewStarRow
                  rating={rating}
                  onRate={(value) => {
                    onRatingChange(value);
                  }}
                  size={38}
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: rating > 0 ? colors.text : colors.textMuted,
                    fontWeight: rating > 0 ? '600' : '400',
                  }}
                >
                  {ratingLabel}
                </Text>
                {ratingError && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="alert-circle-outline" size={13} color={colors.danger} />
                    <Text style={{ fontSize: 12, color: colors.danger }}>Please select a rating</Text>
                  </View>
                )}
              </View>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: colors.textSecondary,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Your Review
              </Text>
              <TextInput
                value={comment}
                onChangeText={onCommentChange}
                placeholder="Share your experience with this product..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={5}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colors.borderStrong,
                  padding: 14,
                  fontSize: 15,
                  color: colors.text,
                  textAlignVertical: 'top',
                  minHeight: 120,
                }}
              />
              <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4, textAlign: 'right' }}>
                {comment.length}/500
              </Text>
            </View>

            <TouchableOpacity
              onPress={onSubmit}
              disabled={submitting}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                opacity: submitting ? 0.8 : 1,
              }}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>
                  Submit Review
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
