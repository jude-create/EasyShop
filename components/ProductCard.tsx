// src/components/ProductCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { Product } from '../constants/products';
import { useCart } from '../context/CartContext';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: `/product/${product.id}`,
      params: { product: JSON.stringify(product) },
    });
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
     Alert.alert(
          "Added to Cart",
          `${product.name} has been added to your cart!`,
          [{ text: "OK" }]
        );
  };

  return (
    <TouchableOpacity 
      onPress={() => handleProductPress(product)}
      className="bg-white mx-4 mb-3 rounded-xl p-3 flex-row shadow-sm"
      activeOpacity={0.7}
    >
      <View className="w-20 h-20 bg-gray-100 rounded-xl justify-center items-center mr-4">
        <Image source={product.image} className="w-full h-full" resizeMode="contain" />
      </View>

      <View className="flex-1 justify-between">
        <View>
          <Text className="font-bold text-base mb-1">{product.name}</Text>
          <Text className="text-gray-600 text-sm mb-2">{product.description}</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-blue-600 font-bold text-lg">
            {product.price}
          </Text>

          <TouchableOpacity 
            className="bg-blue-600 px-4 py-2 rounded-lg "
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
          >
            <Text className='text-white  ' >Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
