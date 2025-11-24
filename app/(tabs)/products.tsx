// app/products.tsx
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCart } from "../context/CartContext";
import Feather from '@expo/vector-icons/Feather';

export interface Product {
  id: number;
  emoji: string;
  name: string;
  price: string;
  description?: string;
}

export default function Products() {
  const { addToCart } = useCart();
  const router = useRouter();

  const products: Product[] = [
    { id: 1, emoji: "📱", name: "Samsung Galaxy S23", price: "₦450,000" },
    { id: 2, emoji: "💻", name: "Dell XPS 13", price: "₦750,000" },
    { id: 3, emoji: "🎧", name: "Sony WH-1000XM4", price: "₦180,000" },
    { id: 4, emoji: "👟", name: "Nike Air Max", price: "₦65,000" },
    { id: 5, emoji: "⌚", name: "Apple Watch S9", price: "₦250,000" },
    { id: 6, emoji: "📷", name: "Canon EOS R6", price: "₦350,000" },
    { id: 7, emoji: "🎮", name: "PS5 Console", price: "₦420,000" },
    { id: 8, emoji: "📺", name: "LG OLED TV", price: "₦950,000" },
  ];

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: `/product/${product.id}`,
      params: { product: JSON.stringify(product) },
    });
  };

 const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <SafeAreaView className="h-screen bg-blue-600">
      <ScrollView className="bg-gray-50 flex-1 mb-10">

        {/* Search Bar */}
        <View className="flex-row items-center bg-white mx-4 my-4 p-2 rounded-lg shadow-sm">
           <Feather name="search" size={22} color="black" />
          <TextInput
            placeholder="Search products..."
            className="flex-1 text-base"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Products Grid */}
        <View className="flex-row flex-wrap px-2">
          {products.map((product) => (
            <View key={product.id} className="w-1/2 p-2">
              <TouchableOpacity
                className="bg-white rounded-xl p-3 shadow-sm"
                onPress={() => handleProductPress(product)}
                activeOpacity={0.7}
              >
                <View className="aspect-square bg-gray-100 rounded-xl justify-center items-center mb-3">
                  <Text className="text-5xl">{product.emoji}</Text>
                </View>

                <Text className="font-bold text-sm mb-1" numberOfLines={2}>
                  {product.name}
                </Text>

                <Text className="text-blue-600 font-bold text-base mb-2">
                  {product.price}
                </Text>

                <TouchableOpacity
                  className="bg-blue-600 py-2 rounded-lg"
                  onPress={() => handleAddToCart(product)}
                >
                  <Text className="text-white font-bold text-xs text-center">
                    Add to Cart
                  </Text>
                </TouchableOpacity>

              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
