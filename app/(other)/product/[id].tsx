// app/product/[id].tsx
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "@/app/context/CartContext";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export interface Product {
  id: number;
  emoji: string;
  name: string;
  price: string;
  description?: string;
}

const ProductDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const product: Product = JSON.parse(params.product as string);

  const [quantity, setQuantity] = useState(1);

 const { addToCart } = useCart();

const handleAddToCart = () => {
  const itemToAdd = {
    ...product,
    quantity,
  };

  addToCart(itemToAdd); 

  Alert.alert(
    "Added to Cart",
    `${quantity}x ${product.name} added to your cart!`,
    [{ text: "OK" }]
  );
};


  return (
    <SafeAreaView className="h-screen bg-blue-600">
      <View className="flex-1 bg-gray-50 ">

        <TouchableOpacity
        onPress={() => router.push("/(tabs)/products")}
        className="px-3 pb-1 pt-2">
         <FontAwesome5 name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      <ScrollView >
       
        {/* Product Image */}
        <View className="bg-gray-100 h-80 justify-center items-center">
          <Text className="text-9xl">{product.emoji}</Text>
        </View>

        {/* Product Info */}
        <View className="p-6">
          <Text className="text-2xl font-bold mb-2">{product.name}</Text>

          <Text className="text-3xl font-bold text-blue-600 mb-4">
            {product.price}
          </Text>

          <Text className="text-gray-600 text-base mb-6 leading-6">
            {product.description ??
              "This is a premium product with great quality. Details are coming soon."}
          </Text>

          {/* Quantity */}
          <View className="mb-6">
            <Text className="text-base font-bold mb-3">Quantity</Text>

            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-gray-200 w-12 h-12 rounded-lg justify-center items-center"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text className="text-2xl font-bold">-</Text>
              </TouchableOpacity>

              <Text className="text-2xl font-bold mx-6">{quantity}</Text>

              <TouchableOpacity
                className="bg-gray-200 w-12 h-12 rounded-lg justify-center items-center"
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text className="text-2xl font-bold">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Features */}
          <View className="mb-6">
            <Text className="text-base font-bold mb-3">Features</Text>
            <Text className="text-gray-600 pb-1"> Free shipping on orders over ₦50,000</Text>
            <Text className="text-gray-600 pb-1"> 30-day money back guarantee</Text>
            <Text className="text-gray-600 pb-1"> 1 year warranty included</Text>
            <Text className="text-gray-600 pb-1"> 24/7 customer support</Text>
          </View>
        </View>

      </ScrollView>

      {/* Add to Cart Button */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl"
          onPress={handleAddToCart}
        >
          <Text className="text-white text-center font-bold text-lg">
            Add {quantity} to Cart
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
