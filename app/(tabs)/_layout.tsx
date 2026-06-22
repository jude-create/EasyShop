import { Tabs } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { TabBarScrollProvider, useTabBarVisibility } from '../../context/TabBarScrollContext';

function CartTabIcon({ color, focused }: { color: string; focused: boolean }) {
  const { totalItems } = useCart();
  return (
    <View style={{ position: 'relative' }}>
      <Ionicons name={focused ? 'bag' : 'bag-outline'} size={24} color={color} />
      {totalItems > 0 && (
        <View style={{ position: 'absolute', top: -4, right: -8, backgroundColor: '#EF4444', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
          <Text style={{ color: 'white', fontSize: 9, fontWeight: '700' }}>
            {totalItems > 99 ? '99+' : totalItems}
          </Text>
        </View>
      )}
    </View>
  );
}

function WishlistTabIcon({ color, focused }: { color: string; focused: boolean }) {
  const { totalWishlistItems } = useWishlist();
  return (
    <View style={{ position: 'relative' }}>
      <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
      {totalWishlistItems > 0 && (
        <View style={{ position: 'absolute', top: -4, right: -8, backgroundColor: '#EC4899', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
          <Text style={{ color: 'white', fontSize: 9, fontWeight: '700' }}>
            {totalWishlistItems > 99 ? '99+' : totalWishlistItems}
          </Text>
        </View>
      )}
    </View>
  );
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 82 : 72;

function TabsNavigator() {
  const { colors } = useTheme();
  const { isTabBarHidden } = useTabBarVisibility();
  const [isTabBarCollapsed, setIsTabBarCollapsed] = useState(false);
  const tabBarOffset = useRef(new Animated.Value(0)).current;
  const tabBarOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isTabBarHidden) {
      setIsTabBarCollapsed(false);
    }

    Animated.parallel([
      Animated.timing(tabBarOffset, {
        toValue: isTabBarHidden ? TAB_BAR_HEIGHT + 16 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(tabBarOpacity, {
        toValue: isTabBarHidden ? 0 : 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished && isTabBarHidden) {
        setIsTabBarCollapsed(true);
      }
    });
  }, [isTabBarHidden, tabBarOffset, tabBarOpacity]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: {
          display: isTabBarCollapsed ? 'none' : 'flex',
          backgroundColor: isTabBarCollapsed ? 'transparent' : colors.tabBg,
          borderTopColor: isTabBarCollapsed ? 'transparent' : colors.border,
          borderTopWidth: isTabBarCollapsed ? 0 : 0.5,
          height: isTabBarCollapsed ? 0 : TAB_BAR_HEIGHT,
          paddingBottom: isTabBarCollapsed ? 0 : Platform.OS === 'ios' ? 24 : 24,
          paddingTop: isTabBarCollapsed ? 0 : 8,
          elevation: 0,
          shadowOpacity: 0,
          opacity: tabBarOpacity as any,
          transform: [{ translateY: tabBarOffset as any }],
          overflow: 'hidden',
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
          
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, focused }) => (
            <WishlistTabIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <CartTabIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <TabBarScrollProvider>
      <TabsNavigator />
    </TabBarScrollProvider>
  );
}
