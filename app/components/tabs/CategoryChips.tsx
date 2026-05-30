import { ScrollView, Text, TouchableOpacity } from 'react-native';

interface CategoryChipsProps {
  colors: {
    card: string;
    border: string;
    borderStrong: string;
    primary: string;
    text: string;
  };
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryChips({
  colors,
  categories,
  activeCategory,
  onSelect,
}: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8, alignItems: 'center' }}
      style={{
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor: colors.card,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
      }}
    >
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <TouchableOpacity
            key={category}
            onPress={() => onSelect(category)}
            style={{
              paddingHorizontal: 16,
              minHeight: 34,
              borderRadius: 20,
              backgroundColor: isActive ? colors.primary : colors.card,
              borderWidth: 1,
              borderColor: isActive ? colors.primary : colors.borderStrong,
              justifyContent: 'center',
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: isActive ? '700' : '500',
                color: isActive ? 'white' : colors.text,
              }}
            >
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
