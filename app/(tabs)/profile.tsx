import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import  MaterialCommunityIcons  from '@expo/vector-icons/MaterialCommunityIcons';

export default function profile() {
   const router = useRouter();
  return (
   <SafeAreaView className='h-screen bg-blue-600'>
    <View className='flex-1 bg-gray-100  justify-center px-4'>

       {/* Logo */}
          <View className="bg-blue-600 rounded-2xl p-4 mb-4 shadow-lg  items-center">
            <MaterialCommunityIcons name="shopping" size={56} color="white" />
          </View>
     <Button mode="contained"
      buttonColor="#2563eb"
        textColor="#FFFFFF"
      onPress={() => router.push("/(auth)/LoginScreen")}>
      Logout
     </Button>
    </View>
   </SafeAreaView>
  )
}