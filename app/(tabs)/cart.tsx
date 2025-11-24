import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useCart } from '../context/CartContext';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Cart() {
  const { cart, removeFromCart } = useCart(); // <-- get removeFromCart

  return (
    <SafeAreaView className='h-screen bg-blue-600'>
      <ScrollView className="flex-1 bg-gray-50">
        <Text className="text-2xl font-bold px-4 mt-4 text-center">Your Shopping Cart</Text>
        <View className="border-b border-gray-200 my-3" />

        {cart.length === 0 ? (
          <View className="items-center mt-48">
            <Feather name="shopping-bag" size={44} color="gray" />
            <Text className="text-gray-500 text-lg pt-3">No items in cart</Text>
          </View>
        ) : (
          cart.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center p-4 border-b border-gray-200"
            >
              <Text className="text-4xl mr-4">{item.emoji}</Text>
              <View className="flex-1">
                <Text className="font-bold text-base">{item.name}</Text>
                <Text className="text-blue-600 font-bold">{item.price}</Text>
                <Text className="text-gray-600">
                  Quantity: {item.quantity}
                </Text>
              </View>

              {/* Wrap icon in TouchableOpacity */}
              <TouchableOpacity onPress={() => removeFromCart(item)}>
                <Feather name="x-circle" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
