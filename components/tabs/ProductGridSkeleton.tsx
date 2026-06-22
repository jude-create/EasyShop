import { Animated, View } from 'react-native';
import { useEffect, useRef } from 'react';
import type { AppColors } from '../../context/ThemeContext';

interface ProductGridSkeletonProps {
  colors: AppColors;
  isDark: boolean;
  count?: number;
}

function SkeletonBar({
  backgroundColor,
  width,
  height,
  borderRadius = 999,
}: {
  backgroundColor: string;
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
}) {
  return <View style={{ width, height, borderRadius, backgroundColor }} />;
}

export default function ProductGridSkeleton({
  colors,
  isDark,
  count = 6,
}: ProductGridSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.55)).current;
  const blockColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const softBlockColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.55,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={{ flexDirection: 'row', flexWrap: 'wrap', opacity }}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={{ width: '50%', padding: 4 }}>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 18,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: isDark ? 0.18 : 0.06,
              shadowRadius: 16,
              elevation: 2,
              overflow: 'hidden',
            }}
          >
            <View style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 12, backgroundColor: softBlockColor, zIndex: 2 }} />
            <View
              style={{
                backgroundColor: isDark ? colors.subtle : colors.primaryLight,
                borderRadius: 14,
                height: 96,
                marginBottom: 12,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={{ width: '58%', height: 54, borderRadius: 12, backgroundColor: blockColor }} />
            </View>
            <View style={{ gap: 7, marginBottom: 10 }}>
              <SkeletonBar backgroundColor={blockColor} width="88%" height={12} />
              <SkeletonBar backgroundColor={blockColor} width="62%" height={12} />
            </View>
            <View style={{ marginBottom: 12 }}>
              <SkeletonBar backgroundColor={softBlockColor} width={72} height={22} />
            </View>
            <View style={{ marginBottom: 12 }}>
              <SkeletonBar backgroundColor={blockColor} width="64%" height={14} />
            </View>
            <SkeletonBar backgroundColor={colors.primaryLight} width="100%" height={32} borderRadius={14} />
          </View>
        </View>
      ))}
    </Animated.View>
  );
}
