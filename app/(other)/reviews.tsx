import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { useReviews, Review } from '../../context/ReviewContext';


type FilterType = 'All' | '5' | '4' | '3' | '2' | '1';

// Products from delivered orders available to review
const REVIEWABLE_PRODUCTS = [
  { productId: 1,  productName: 'Samsung Galaxy S23',   productImage: require('../../assets/images/samsung.jpg'), orderId: 'CWR-482910' },
  { productId: 3,  productName: 'Sony WH-1000XM4',     productImage: require('../../assets/images/headphone.jpg'), orderId: 'CWR-482910' },
  { productId: 2,  productName: 'Dell XPS 13 Laptop',  productImage: require('../../assets/images/laptop.jpg'), orderId: 'CWR-371845' },
  { productId: 7,  productName: 'PlayStation 5',        productImage: require('../../assets/images/pad.jpg'), orderId: 'CWR-183920' },
];

function StarRow({ rating, onRate, size = 24 }: { rating: number; onRate?: (r: number) => void; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <TouchableOpacity key={s} onPress={() => onRate?.(s)} disabled={!onRate} activeOpacity={0.7}>
          <Ionicons
            name={s <= rating ? 'star' : 'star-outline'}
            size={size}
            color={s <= rating ? '#F59E0B' : '#D1D5DB'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function RatingBar({ label, count, total, colors }: { label: string; count: number; total: number; colors: any }) {
  const pct = total > 0 ? count / total : 0;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <Text style={{ fontSize: 12, color: colors.textSecondary, width: 14, textAlign: 'right' }}>{label}</Text>
      <Ionicons name="star" size={11} color="#F59E0B" />
      <View style={{ flex: 1, height: 6, backgroundColor: colors.subtle, borderRadius: 3, overflow: 'hidden' }}>
        <View style={{ width: `${pct * 100}%`, height: 6, backgroundColor: '#F59E0B', borderRadius: 3 }} />
      </View>
      <Text style={{ fontSize: 11, color: colors.textMuted, width: 18, textAlign: 'right' }}>{count}</Text>
    </View>
  );
}

const FILTERS: FilterType[] = ['All', '5', '4', '3', '2', '1'];

export default function ReviewsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { reviews, addReview, totalReviews, averageRating, hasReviewed } = useReviews();

  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(REVIEWABLE_PRODUCTS[0]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState(false);

  const filtered = activeFilter === 'All'
    ? reviews
    : reviews.filter((r) => r.rating === parseInt(activeFilter));

  // Rating distribution
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  const unreviewedProducts = REVIEWABLE_PRODUCTS.filter((p) => !hasReviewed(p.productId));

  const handleSubmit = async () => {
    if (rating === 0) { setRatingError(true); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    addReview({
      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      productImage: selectedProduct.productImage,
      rating,
      comment: comment.trim() || 'No comment provided.',
      orderId: selectedProduct.orderId,
    });
    setSubmitting(false);
    setModalOpen(false);
    setRating(0);
    setComment('');
    setRatingError(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.card, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, letterSpacing: -0.3 }}>My Reviews</Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 1 }}>{totalReviews} reviews written</Text>
        </View>
        {unreviewedProducts.length > 0 && (
          <TouchableOpacity
            onPress={() => { setSelectedProduct(unreviewedProducts[0]); setModalOpen(true); }}
            style={{ backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 }}
            activeOpacity={0.85}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>+ Write Review</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Rating Summary */}
        <View style={{ margin: 16, backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: colors.border, flexDirection: 'row', gap: 16 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: 80 }}>
            <Text style={{ fontSize: 42, fontWeight: '800', color: colors.text, letterSpacing: -1 }}>{averageRating}</Text>
            <StarRow rating={Math.round(averageRating)} size={14} />
            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>{totalReviews} reviews</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {dist.map((d) => (
              <RatingBar key={d.star} label={d.star.toString()} count={d.count} total={totalReviews} colors={colors} />
            ))}
          </View>
        </View>

        {/* Pending Reviews */}
        {unreviewedProducts.length > 0 && (
          <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 10 }}>
              Pending Reviews ({unreviewedProducts.length})
            </Text>
            <View style={{ gap: 8 }}>
              {unreviewedProducts.map((p) => (
                <TouchableOpacity
                  key={p.productId}
                  onPress={() => { setSelectedProduct(p); setRating(0); setComment(''); setRatingError(false); setModalOpen(true); }}
                  style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, padding: 12, gap: 12, borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed' }}
                  activeOpacity={0.85}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.subtle, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      source={p.productImage}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{p.productName}</Text>
                    <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>Order {p.orderId}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                    <Ionicons name="star-outline" size={12} color={colors.primary} />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>Review</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}>
          {FILTERS.map((f) => {
            const isActive = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 4,
                  paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
                  backgroundColor: isActive ? colors.primary : colors.card,
                  borderWidth: 1,
                  borderColor: isActive ? 'transparent' : colors.borderStrong,
                }}
                activeOpacity={0.8}
              >
                {f !== 'All' && <Ionicons name="star" size={11} color={isActive ? 'white' : '#F59E0B'} />}
                <Text style={{ fontSize: 13, fontWeight: isActive ? '700' : '500', color: isActive ? 'white' : colors.text }}>
                  {f === 'All' ? 'All' : `${f} Star${f === '1' ? '' : 's'}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Reviews List */}
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <Ionicons name="star-outline" size={44} color={colors.textMuted} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textSecondary, marginTop: 12 }}>No reviews yet</Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 4, textAlign: 'center' }}>
                {activeFilter === 'All' ? 'Your reviews will appear here' : `No ${activeFilter}-star reviews`}
              </Text>
            </View>
          ) : (
            filtered.map((review) => (
              <View
                key={review.id}
                style={{ backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 0.5, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: isDark ? 0.2 : 0.04, shadowRadius: 3, elevation: 1 }}
              >
                {/* Product row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <View style={{ width: 42, height: 42, borderRadius: 11, backgroundColor: colors.subtle, alignItems: 'center', justifyContent: 'center' }}>
                         <Image
    source={typeof review.productImage === 'string' ? { uri: review.productImage } : review.productImage}
    style={{ width: 36, height: 36, borderRadius: 9 }}
    resizeMode="contain"
  />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>{review.productName}</Text>
                    <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>Order {review.orderId}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <StarRow rating={review.rating} size={14} />
                    <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 3 }}>{review.date}</Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={{ height: 0.5, backgroundColor: colors.border, marginBottom: 10 }} />

                {/* Comment */}
                <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>{review.comment}</Text>

                {/* Rating badge */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10, alignSelf: 'flex-start', backgroundColor: review.rating >= 4 ? colors.greenLight : review.rating === 3 ? colors.primaryLight : 'rgba(239,68,68,0.08)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Ionicons name="star" size={11} color={review.rating >= 4 ? colors.green : review.rating === 3 ? colors.primary : '#EF4444'} />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: review.rating >= 4 ? colors.green : review.rating === 3 ? colors.primary : '#EF4444' }}>
                    {review.rating >= 4 ? 'Positive' : review.rating === 3 ? 'Neutral' : 'Critical'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Write Review Modal */}
      <Modal visible={modalOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalOpen(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.card, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
              <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>Write a Review</Text>
              <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

              {/* Product selector */}
              {unreviewedProducts.length > 1 && (
                <View>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>Product</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {unreviewedProducts.map((p) => (
                      <TouchableOpacity
                        key={p.productId}
                        onPress={() => setSelectedProduct(p)}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: selectedProduct.productId === p.productId ? colors.primaryLight : colors.subtle, borderWidth: 1.5, borderColor: selectedProduct.productId === p.productId ? colors.primary : 'transparent' }}
                        activeOpacity={0.8}
                      >
                        <Image
                          source={p.productImage}
                          style={{ width: 36, height: 36 }}
                          resizeMode="contain"
                        />
                        <Text style={{ fontSize: 12, fontWeight: '600', color: selectedProduct.productId === p.productId ? colors.primary : colors.text }}>{p.productName}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Selected product display */}
              <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 0.5, borderColor: colors.border }}>
                <View style={{ width: 52, height: 52, borderRadius: 13, backgroundColor: colors.subtle, alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={selectedProduct.productImage}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{selectedProduct.productName}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Order {selectedProduct.orderId}</Text>
                </View>
              </View>

              {/* Star rating */}
              <View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 12 }}>
                  Your Rating <Text style={{ color: colors.danger }}>*</Text>
                </Text>
                <View style={{ alignItems: 'center', gap: 8 }}>
                  <StarRow rating={rating} onRate={(r) => { setRating(r); setRatingError(false); }} size={38} />
                  <Text style={{ fontSize: 13, color: rating > 0 ? colors.text : colors.textMuted, fontWeight: rating > 0 ? '600' : '400' }}>
                    {rating === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                  </Text>
                  {ratingError && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="alert-circle-outline" size={13} color={colors.danger} />
                      <Text style={{ fontSize: 12, color: colors.danger }}>Please select a rating</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Comment */}
              <View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>Your Review</Text>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Share your experience with this product..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={5}
                  style={{ backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.borderStrong, padding: 14, fontSize: 15, color: colors.text, textAlignVertical: 'top', minHeight: 120 }}
                />
                <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4, textAlign: 'right' }}>{comment.length}/500</Text>
              </View>

              {/* Submit */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                style={{ backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', opacity: submitting ? 0.8 : 1 }}
                activeOpacity={0.85}
              >
                {submitting
                  ? <ActivityIndicator color="white" />
                  : <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>Submit Review</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}