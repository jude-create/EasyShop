import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps } from 'react-native';
import { useFocusEffect } from 'expo-router';

interface TabBarScrollContextValue {
  isTabBarHidden: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  showTabBar: () => void;
}

const TabBarScrollContext = createContext<TabBarScrollContextValue | null>(null);

export function TabBarScrollProvider({ children }: { children: ReactNode }) {
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);
  const lastOffsetY = useRef(0);

  const showTabBar = useCallback(() => {
    setIsTabBarHidden(false);
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = Math.max(0, event.nativeEvent.contentOffset.y);
      const delta = offsetY - lastOffsetY.current;

      if (offsetY < 24 || delta < -8) {
        setIsTabBarHidden(false);
      } else if (offsetY > 80 && delta > 8) {
        setIsTabBarHidden(true);
      }

      lastOffsetY.current = offsetY;
    },
    [],
  );

  const value = useMemo(
    () => ({
      isTabBarHidden,
      handleScroll,
      showTabBar,
    }),
    [handleScroll, isTabBarHidden, showTabBar],
  );

  return <TabBarScrollContext.Provider value={value}>{children}</TabBarScrollContext.Provider>;
}

export function useTabBarScrollHandler(): Pick<
  ScrollViewProps,
  'onScroll' | 'onScrollBeginDrag' | 'onScrollEndDrag' | 'onMomentumScrollEnd' | 'scrollEventThrottle'
> {
  const context = useContext(TabBarScrollContext);

  if (!context) {
    throw new Error('useTabBarScrollHandler must be used within TabBarScrollProvider');
  }

  const { handleScroll, showTabBar } = context;

  useFocusEffect(
    useCallback(() => {
      showTabBar();
      return showTabBar;
    }, [showTabBar]),
  );

  return useMemo(
    () => ({
      onScroll: handleScroll,
      onScrollBeginDrag: handleScroll,
      onScrollEndDrag: handleScroll,
      onMomentumScrollEnd: handleScroll,
      scrollEventThrottle: 16,
    }),
    [handleScroll],
  );
}

export function useTabBarVisibility() {
  const context = useContext(TabBarScrollContext);

  if (!context) {
    throw new Error('useTabBarVisibility must be used within TabBarScrollProvider');
  }

  return context;
}
