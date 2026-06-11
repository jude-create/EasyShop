import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface HomeHeroProps {
  colors: {
    primary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    primaryLight: string;
    greenLight: string;
    green: string;
    dangerLight: string;
    danger: string;
    subtle: string;
  };
  heroStats: { label: string; value: string }[];
  onBrowsePress: () => void;
}

export default function HomeHero({ colors, heroStats, onBrowsePress }: HomeHeroProps) {
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 34,
      }}
    >
      <View
        style={{
          
          padding: 18,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -34,
            right: -18,
            width: 92,
            height: 92,
            borderRadius: 46,
            backgroundColor: 'rgba(255,255,255,0.10)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -34,
            left: -18,
            width: 92,
            height: 92,
            borderRadius: 46,
            backgroundColor: 'rgba(255,255,255,0.08)',
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(255,255,255,0.16)',
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 10, color: 'white', fontWeight: '700', letterSpacing: 0.8 }}>CW RETAIL</Text>
            </View>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', fontWeight: '500', marginBottom: 6 }}>
              Browse, checkout, and manage store operations in one place
            </Text>
            <Text style={{ fontSize: 28, fontWeight: '900', color: 'white', letterSpacing: -0.8, lineHeight: 34 }}>
              Retail that feels fast, modern, and ready to sell
            </Text>
          </View>
          <View
            style={{
              width: 52,
              height: 52,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="storefront" size={24} color="white" />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {heroStats.map((item) => (
            <View
              key={item.label}
              style={{
                flexGrow: 1,
                minWidth: 92,
                backgroundColor: 'rgba(255,255,255,0.10)',
                borderRadius: 18,
                paddingVertical: 12,
                paddingHorizontal: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '800', color: 'white' }}>{item.value}</Text>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.72)', marginTop: 2 }}>{item.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={onBrowsePress}
          activeOpacity={0.85}
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            paddingVertical: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Ionicons name="bag-outline" size={18} color={colors.primary} />
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '800' }}>Browse products</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
