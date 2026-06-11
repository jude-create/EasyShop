import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { useReviews } from '../../context/ReviewContext';
import ReviewScreenHeader from '../../components/reviews/ReviewScreenHeader';
import ReviewSummaryCard from '../../components/reviews/ReviewSummaryCard';
import ReviewPendingList from '../../components/reviews/ReviewPendingList';
import ReviewFilterPills from '../../components/reviews/ReviewFilterPills';
import ReviewCard from '../../components/reviews/ReviewCard';
import ReviewWriteModal from '../../components/reviews/ReviewWriteModal';
import { REVIEWABLE_PRODUCTS } from '../../components/reviews/reviewData';
import type { ReviewFilterType, ReviewableProduct } from '../../components/reviews/reviewTypes';

const FILTERS: ReviewFilterType[] = ['All', '5', '4', '3', '2', '1'];

export default function ReviewsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { reviews, addReview, totalReviews, averageRating, hasReviewed } = useReviews();

  const [activeFilter, setActiveFilter] = useState<ReviewFilterType>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ReviewableProduct>(REVIEWABLE_PRODUCTS[0]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState(false);

  const filteredReviews =
    activeFilter === 'All'
      ? reviews
      : reviews.filter((review) => review.rating === Number(activeFilter));

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
  }));

  const unreviewedProducts = REVIEWABLE_PRODUCTS.filter((product) => !hasReviewed(product.productId));

  const openModalForProduct = (product: ReviewableProduct) => {
    setSelectedProduct(product);
    setRating(0);
    setComment('');
    setRatingError(false);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setRatingError(true);
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

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
      <ReviewScreenHeader
        colors={colors}
        totalReviews={totalReviews}
        canWriteReview={unreviewedProducts.length > 0}
        onBack={() => router.back()}
        onWriteReview={() => openModalForProduct(unreviewedProducts[0])}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <ReviewSummaryCard
          colors={colors}
          averageRating={averageRating}
          totalReviews={totalReviews}
          distribution={distribution}
        />

        <ReviewPendingList
          colors={colors}
          products={unreviewedProducts}
          onPickProduct={openModalForProduct}
        />

        <ReviewFilterPills
          colors={colors}
          filters={FILTERS}
          activeFilter={activeFilter}
          onChangeFilter={setActiveFilter}
        />

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {filteredReviews.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <Ionicons name="star-outline" size={44} color={colors.textMuted} />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: colors.textSecondary,
                  marginTop: 12,
                }}
              >
                No reviews yet
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  marginTop: 4,
                  textAlign: 'center',
                }}
              >
                {activeFilter === 'All' ? 'Your reviews will appear here' : `No ${activeFilter}-star reviews`}
              </Text>
            </View>
          ) : (
            filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} colors={colors} isDark={isDark} />
            ))
          )}
        </View>
      </ScrollView>

      <ReviewWriteModal
        visible={modalOpen}
        colors={colors}
        products={unreviewedProducts}
        selectedProduct={selectedProduct}
        rating={rating}
        comment={comment}
        submitting={submitting}
        ratingError={ratingError}
        onClose={() => setModalOpen(false)}
        onSelectProduct={(product) => setSelectedProduct(product)}
        onRatingChange={(value) => {
          setRating(value);
          setRatingError(false);
        }}
        onCommentChange={setComment}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}
