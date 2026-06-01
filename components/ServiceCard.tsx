import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type ServiceCardProps = {
   icon: keyof typeof Ionicons.glyphMap;
   color?: string;
  title: string;
  description: string;
};

const ServiceCard = ({ icon, title, description, color }: ServiceCardProps) => {
  return (
    <View className="bg-white p-4 rounded-xl mb-3 shadow-sm">
      <View className="flex-row items-center mb-2">
       <Ionicons name={icon} size={24} color={color} />
        <Text className="text-lg font-bold flex-1 pl-2">{title}</Text>
      </View>
      <Text className="text-gray-600 text-sm leading-5">{description}</Text>
    </View>
  );
};

export default ServiceCard;