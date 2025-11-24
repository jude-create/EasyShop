// src/components/FormInput.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FormInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  icon?: keyof typeof Feather.glyphMap;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  showSecureToggle?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  icon,
  secureTextEntry,
  onToggleSecure,
  showSecureToggle = false,
  ...props
}) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2 font-semibold">{label}</Text>
      <View
        className={`flex-row items-center border rounded-xl px-4 py-3 ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        }`}
      >
        {icon && <Feather name={icon} size={20} color="#9ca3af" />}
        <TextInput
          className={`flex-1 text-base ${icon ? 'ml-3' : ''}`}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {showSecureToggle && onToggleSecure && (
          <TouchableOpacity onPress={onToggleSecure}>
            <Feather
              name={secureTextEntry ? 'eye-off' : 'eye'}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View className="flex-row items-center mt-1">
          <Feather name="alert-circle" size={14} color="#ef4444" />
          <Text className="text-red-500 text-sm ml-1">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default FormInput;