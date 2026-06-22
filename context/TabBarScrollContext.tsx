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
  const scrollDistance = useRef(0);
  const scrollDirection = useRef<'up' | 'down' | null>(null);

  const showTabBar = useCallback(() => {
    setIsTabBarHidden(false);
    lastOffsetY.current = 0;
    scrollDistance.current = 0;
    scrollDirection.current = null;
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = Math.max(0, event.nativeEvent.contentOffset.y);
      const delta = offsetY - lastOffsetY.current;
      const nextDirection = delta > 0 ? 'down' : delta < 0 ? 'up' : null;

      if (offsetY < 24) {
        setIsTabBarHidden(false);
        scrollDistance.current = 0;
      } else if (nextDirection) {
        if (scrollDirection.current !== nextDirection) {
          scrollDirection.current = nextDirection;
          scrollDistance.current = 0;
        }

        scrollDistance.current += Math.abs(delta);
      }

      if (nextDirection === 'down' && offsetY > 80 && scrollDistance.current >= 24) {
        setIsTabBarHidden(true);
        scrollDistance.current = 0;
      } else if (nextDirection === 'up' && scrollDistance.current >= 32) {
        setIsTabBarHidden(false);
        scrollDistance.current = 0;
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
  'onScroll' | 'scrollEventThrottle'
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
