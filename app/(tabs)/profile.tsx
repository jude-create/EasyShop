import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import TabShell from '../components/tabs/TabShell';
import ProfileHero from '../components/tabs/ProfileHero';
import StatsStrip from '../components/tabs/StatsStrip';
import ThemeSwitcher from '../components/tabs/ThemeSwitcher';
import MenuSection from '../components/tabs/MenuSection';


const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: 'person-outline' as const, label: 'Edit Profile', chevron: true, route: '/editProfile' },
      { icon: 'location-outline' as const, label: 'Saved Addresses', chevron: true, route: '/savedAddresses' },
      { icon: 'card-outline' as const, label: 'Payment Methods', chevron: true, route: '/paymentMethods' },
    ],
  },
  {
    title: 'Orders',
    items: [
      { icon: 'bag-outline' as const, label: 'Order History', chevron: true, route: '/orderHistory' },
      { icon: 'heart-outline' as const, label: 'Wishlist', chevron: true, route: '/wishlist' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'notifications-outline' as const, label: 'Notifications', chevron: true, route: null },
      { icon: 'lock-closed-outline' as const, label: 'Security', chevron: true, route: null },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle-outline' as const, label: 'Help & Support', chevron: true, route: null },
      { icon: 'information-circle-outline' as const, label: 'About CW Retail', chevron: true, route: null },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  const { clearCart } = useCart();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          clearCart();
          router.replace('/(auth)');
        },
      },
    ]);
  };

  return (
    <TabShell backgroundColor={colors.primary} contentBackgroundColor={colors.background}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <ProfileHero colors={colors} name="Admin User" email="admin@cwretail.com" role="Store Manager" />

        <StatsStrip
          colors={colors}
          isDark={isDark}
         
        />

        <ThemeSwitcher colors={colors} themeMode={themeMode} onChange={setThemeMode} />

        {MENU_SECTIONS.map((section) => (
          <MenuSection
            key={section.title}
            colors={colors}
            title={section.title}
            items={section.items}
            onItemPress={(route) => router.push(route as any)}
          />
        ))}

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginHorizontal: 16,
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: colors.dangerLight,
            borderRadius: 14,
            paddingVertical: 15,
            borderWidth: 1,
            borderColor: `${colors.danger}25`,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.danger }}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', fontSize: 11, color: colors.textMuted, marginTop: 16 }}>
          CW Retail v2.0.0 · Built with Expo
        </Text>

        <View style={{ height: 24 }} />
      </ScrollView>
    </TabShell>
  );
}
