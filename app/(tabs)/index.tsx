import { Link } from 'expo-router';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ServiceCard from '../components/ServiceCard';
import ProductCard from '../components/ProductCard';
import { useRouter } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Product } from './products';

export default function HomeScreen() {
  const router = useRouter();

  // Define featured products
  const featuredProducts: Product[] = [
    {
      id: 1,
      emoji: '📱',
      name: 'Samsung Galaxy S23',
      description: 'Latest Samsung flagship smartphone',
      price: '₦450,000'
    },
    {
      id: 2,
      emoji: '💻',
      name: 'Dell XPS 13 Laptop',
      description: 'Powerful laptop with 11th Gen Intel',
      price: '₦750,000'
    },
    {
      id: 3,
      emoji: '🎧',
      name: 'Sony WH-1000XM4',
      description: 'Premium noise-cancelling headphones',
      price: '₦180,000'
    },
    {
      id: 4,
      emoji: '👟',
      name: 'Nike Air Max',
      description: 'Comfortable running shoes',
      price: '₦65,000'
    }
  ];

  return (
    <SafeAreaView className="h-screen bg-blue-600">
      <View className='bg-gray-50 flex-1'>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {/* Header Section */}
          <View className="bg-blue-600 p-6 items-center">
            <Text className="text-3xl font-bold text-white mb-2">CW RETAIL</Text>
            <Text className="text-sm text-white text-center opacity-90">
              Complete e-commerce and Point of Sale solution for modern retail
            </Text>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-white mx-4 my-4 p-3 rounded-lg shadow-sm">
            <Feather name="search" size={22} color="black" />
            <TextInput
              placeholder="Search products..."
              className="flex-1 text-base"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Quick Action Buttons */}
          <View className="flex-row px-4 gap-3">
            <TouchableOpacity
              className="flex-1 bg-blue-600 p-5 rounded-xl items-center"
              onPress={() => router.push("/(tabs)")}
            >
              <Fontisto name="shopping-bag-1" size={40} color="#ffffff" />
              <Text className="text-white font-bold">Shop Online</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-green-600 p-5  rounded-xl items-center"
              onPress={() => router.push("/(tabs)/products")}
            >
              <Ionicons name="settings" size={40} color="#6b7280" />
              <Text className="text-white font-bold">Admin Portal</Text>
            </TouchableOpacity>
          </View>

          {/* Service Cards */}
          <View className="px-4 mt-6">
           <ServiceCard
  icon="cart-outline"
  color="#2563eb"   
  title="Online Store"
  description="Full-featured e-commerce with cart, checkout, and order management"
/>

<ServiceCard
  icon="laptop-outline"
  color="#16a34a"  
  title="POS Terminal"
  description="Professional point-of-sale system for in-store transactions"
/>

<ServiceCard
  icon="storefront-outline"
  color="purple"   
  title="Admin Dashboard"
  description="Management tools for inventory, sales, and analytics"
/>

          </View>

          {/* Featured Products Section */}
          <Text className="text-xl font-bold px-4 pt-6 pb-3">
            Featured Products
          </Text>

          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          <View className="h-6" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}