// src/screens/LoginScreen.tsx - Fixed Tab Toggle
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from "expo-router";

type TabType = 'signIn' | 'signUp';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('signIn');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Validate Email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate Password Strength
  const validatePasswordStrength = (password: string): string | null => {
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(password)) return 'Must contain uppercase letter';
    if (!/[0-9]/.test(password)) return 'Must contain a number';
    return null;
  };

  // Validate Form
  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (activeTab === 'signUp') {
      const passwordError = validatePasswordStrength(password);
      if (passwordError) newErrors.password = passwordError;
    }

    if (activeTab === 'signUp') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

    
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = () => {
  if (!validateForm()) return;

  setIsLoading(true);
  setTimeout(() => {
    setIsLoading(false);

    // Navigate to tabs regardless of active tab
    router.push("/(tabs)");

    // Optional: Reset form fields if it was Sign Up
    if (activeTab === 'signUp') {
      setActiveTab('signIn');
      setPassword('');
      setConfirmPassword('');
      setEmail('');
      setAddress('');
    }
  }, 1500);
};


  // Password Strength
  const getPasswordStrength = () => {
    if (password.length === 0) return { width: '0%', color: '#e5e7eb', text: '' };
    if (password.length < 6) return { width: '33%', color: '#ef4444', text: 'Weak' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
      return { width: '66%', color: '#f59e0b', text: 'Medium' };
    return { width: '100%', color: '#10b981', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <SafeAreaView className="flex-1 bg-blue-600">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-gray-100"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
            paddingVertical: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View className="bg-blue-600 rounded-2xl p-4 mb-4 shadow-lg">
            <MaterialCommunityIcons name="shopping" size={56} color="white" />
          </View>

          <Text className="text-3xl font-bold mb-2 text-gray-800">CW RETAIL</Text>
          <Text className="text-gray-500 mb-8 text-base">
            Your Complete POS Solution
          </Text>

          {/* Card */}
          <View className="w-full max-w-md mb-7">
            <Text className="text-2xl font-bold mb-6 text-gray-800">
              {activeTab === 'signIn' ? 'Welcome Back' : 'Create Account'}
            </Text>

            {/* Tab Switcher */}
            <View className="flex-row mb-6 bg-gray-100 rounded-full  border border-gray-300">
              <TouchableOpacity
                className={`flex-1 py-3 items-center rounded-full ${
                  activeTab === 'signIn' ? 'bg-blue-600' : ''
                }`}
                onPress={() => {
                  setActiveTab('signIn');
                  setErrors({});
                }}
                activeOpacity={0.7}
              >
                <Text
                  className={`font-semibold ${
                    activeTab === 'signIn' ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 py-3 items-center rounded-full ${
                  activeTab === 'signUp' ? 'bg-blue-600' : ''
                }`}
                onPress={() => {
                  setActiveTab('signUp');
                  setErrors({});
                }}
                activeOpacity={0.7}
              >
                <Text
                  className={`font-semibold ${
                    activeTab === 'signUp' ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-semibold">Email</Text>
              <View
                className={`flex-row items-center border rounded-xl px-4 py-3 ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <Feather name="mail" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="your.email@example.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              {errors.email && (
                <View className="flex-row items-center mt-1">
                  <Feather name="alert-circle" size={14} color="#ef4444" />
                  <Text className="text-red-500 text-sm ml-1">{errors.email}</Text>
                </View>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-semibold">Password</Text>
              <View
                className={`flex-row items-center border rounded-xl px-4 py-3 ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <Feather name="lock" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <View className="flex-row items-center mt-1">
                  <Feather name="alert-circle" size={14} color="#ef4444" />
                  <Text className="text-red-500 text-sm ml-1">{errors.password}</Text>
                </View>
              )}

              {/* Password Strength */}
              {activeTab === 'signUp' && password.length > 0 && (
                <View className="mt-2">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-xs text-gray-600">Password Strength</Text>
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.text}
                    </Text>
                  </View>
                  <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: passwordStrength.width,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Sign Up Extra Fields */}
            {activeTab === 'signUp' && (
              <>
                {/* Confirm Password */}
                <View className="mb-4">
                  <Text className="text-gray-700 mb-2 font-semibold">
                    Confirm Password
                  </Text>
                  <View
                    className={`flex-row items-center border rounded-xl px-4 py-3 ${
                      errors.confirmPassword
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <Feather name="lock" size={20} color="#9ca3af" />
                    <TextInput
                      className="flex-1 ml-3 text-base"
                      placeholder="Confirm your password"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (errors.confirmPassword)
                          setErrors({ ...errors, confirmPassword: undefined });
                      }}
                      placeholderTextColor="#9ca3af"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Feather
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#9ca3af"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && (
                    <View className="flex-row items-center mt-1">
                      <Feather name="alert-circle" size={14} color="#ef4444" />
                      <Text className="text-red-500 text-sm ml-1">
                        {errors.confirmPassword}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Address */}
                
              </>
            )}

            {/* Forgot Password */}
            {activeTab === 'signIn' && (
              <TouchableOpacity className="mb-6">
                <Text className="text-blue-600 text-right font-semibold">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              className={`py-4 rounded-xl items-center ${
                isLoading ? 'bg-gray-400' : 'bg-blue-600'
              }`}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">
                {isLoading
                  ? 'Loading...'
                  : activeTab === 'signIn'
                  ? 'Sign In'
                  : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Terms */}
            {activeTab === 'signUp' && (
              <Text className="text-center text-gray-500 text-xs mt-4">
                By signing up, you agree to our{' '}
                <Text className="text-blue-600">Terms</Text> and{' '}
                <Text className="text-blue-600">Privacy Policy</Text>
              </Text>
            )}
          </View>

         
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}