import { Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReviewFilterType } from './reviewTypes';

interface ReviewFilterPillsProps {
  colors: {
    card: string;
    borderStrong: string;
    primary: string;
    text: string;
  };
  filters: ReviewFilterType[];
  activeFilter: ReviewFilterType;
  onChangeFilter: (filter: ReviewFilterType) => void;
}

export default function ReviewFilterPills({
  colors,
  filters,
  activeFilter,
  onChangeFilter,
}: ReviewFilterPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <TouchableOpacity
            key={filter}
            onPress={() => onChangeFilter(filter)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 20,
              backgroundColor: isActive ? colors.primary : colors.card,
              borderWidth: 1,
              borderColor: isActive ? 'transparent' : colors.borderStrong,
            }}
            activeOpacity={0.8}
          >
            {filter !== 'All' && (
              <Ionicons name="star" size={11} color={isActive ? 'white' : '#F59E0B'} />
            )}
            <Text
              style={{
                fontSize: 13,
                fontWeight: isActive ? '700' : '500',
                color: isActive ? 'white' : colors.text,
              }}
            >
              {filter === 'All' ? 'All' : `${filter} Star${filter === '1' ? '' : 's'}`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
