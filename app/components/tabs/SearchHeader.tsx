import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SearchHeaderProps {
  colors: {
    card: string;
    border: string;
    primary: string;
    text: string;
  };
  title: string;
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
}

export default function SearchHeader({
  colors,
  title,
  value,
  onChangeText,
  onClear,
}: SearchHeaderProps) {
  return (
    <View style={{ backgroundColor: colors.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: 'white', letterSpacing: -0.5, marginBottom: 12 }}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
          gap: 10,
        }}
      >
        <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.7)" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={title}
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={{ flex: 1, fontSize: 14, color: 'white' }}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
