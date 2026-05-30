import { Text, View } from 'react-native';

interface FlowStatsStripProps {
  colors: {
    card: string;
    border: string;
    primary: string;
    textMuted: string;
  };
  stats: { label: string; value: string }[];
}

export default function FlowStatsStrip({ colors, stats }: FlowStatsStripProps) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.card, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
      {stats.map((stat, index) => (
        <View
          key={stat.label}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 12,
            borderRightWidth: index < stats.length - 1 ? 0.5 : 0,
            borderRightColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 }}>
            {stat.value}
          </Text>
          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2, fontWeight: '500' }}>
            {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
