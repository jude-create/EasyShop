import React, { createContext, useContext, useState } from 'react';

export interface Review {
  id: string;
  productId: number;
  productName: string;
  productImage: string | number;
  rating: number;
  comment: string;
  date: string;
  orderId: string;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  totalReviews: number;
  averageRating: number;
  hasReviewed: (productId: number) => boolean;
}

// Seed data so stats strip shows real numbers from the start
const SEED_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 1,
    productName: 'Samsung Galaxy S23',
    productImage: require('../assets/images/samsung.jpg'),
    rating: 5,
    comment: 'Amazing phone! The camera is outstanding and battery life is superb. Highly recommend.',
    date: 'May 25, 2026',
    orderId: 'CWR-482910',
  },
  {
    id: 'r2',
    productId: 3,
    productName: 'Sony WH-1000XM4',
    productImage: require('../assets/images/headphone.jpg'),
    rating: 4,
    comment: 'Excellent noise cancellation. Comfortable for long sessions. Sound quality is top tier.',
    date: 'May 25, 2026',
    orderId: 'CWR-482910',
  },
  {
    id: 'r3',
    productId: 7,
    productName: 'PlayStation 5',
    productImage: require('../assets/images/pad.jpg'),
    rating: 5,
    comment: 'Best gaming console I have ever owned. Load times are incredible.',
    date: 'Apr 29, 2026',
    orderId: 'CWR-183920',
  },
];

const ReviewContext = createContext<ReviewContextType>({
  reviews: SEED_REVIEWS,
  addReview: () => {},
  totalReviews: SEED_REVIEWS.length,
  averageRating: 0,
  hasReviewed: () => false,
});

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);

  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: `r${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const totalReviews = reviews.length;
  const averageRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  const hasReviewed = (productId: number) =>
    !!reviews.find((r) => r.productId === productId);

  return (
    <ReviewContext.Provider value={{ reviews, addReview, totalReviews, averageRating, hasReviewed }}>
      {children}
    </ReviewContext.Provider>
  );
}

export const useReviews = () => useContext(ReviewContext);