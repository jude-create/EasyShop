import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useProfile } from '../../context/ProfileContext';
import { useTabBarScrollHandler } from '../../context/TabBarScrollContext';
import TabShell from '../../components/tabs/TabShell';
import ProfileHero from '../../components/tabs/ProfileHero';
import StatsStrip from '../../components/tabs/StatsStrip';
import ThemeSwitcher from '../../components/tabs/ThemeSwitcher';
import MenuSection from '../../components/tabs/MenuSection';


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
  const { profile, profileLoading, pushToken, notificationStatus, refreshPushNotifications, signOutUser } = useProfile();
  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || profile?.email || 'Guest';
  const email = profile?.email || 'No email available';
  const avatarUri = profile?.avatarUrl;
  const tabBarScrollHandler = useTabBarScrollHandler();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          clearCart();
          await signOutUser();
          router.replace('/(auth)');
        },
      },
    ]);
  };

  return (
    <TabShell backgroundColor={colors.primary} contentBackgroundColor={colors.background}>
      <ScrollView {...tabBarScrollHandler} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 82}}>
        <ProfileHero
          colors={colors}
          name={profileLoading ? 'Loading profile...' : displayName}
          email={profileLoading ? 'Please wait...' : email}
          role="Customer"
          avatarUri={avatarUri}
          onPressAvatar={() => router.push('/(other)/editProfile')}
        />

        <StatsStrip
          colors={colors}
          isDark={isDark}
         
        />

        <ThemeSwitcher colors={colors} themeMode={themeMode} onChange={setThemeMode} />

        {__DEV__ && (
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '800' }}>
                  Notification debug
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
                  Status: {notificationStatus || 'not checked'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={refreshPushNotifications}
                style={{ backgroundColor: colors.primaryLight, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}
                activeOpacity={0.8}
              >
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '800' }}>Refresh</Text>
              </TouchableOpacity>
            </View>
            <Text
              selectable
              numberOfLines={3}
              style={{ color: colors.textMuted, fontSize: 11, lineHeight: 16, marginTop: 10 }}
            >
              {pushToken || ''}
            </Text>
          </View>
        )}

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

       

        
      </ScrollView>
    </TabShell>
  );
}
