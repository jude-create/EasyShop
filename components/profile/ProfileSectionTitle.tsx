import { Text } from 'react-native';

interface ProfileSectionTitleProps {
  colors: {
    textMuted: string;
  };
  title: string;
}

export default function ProfileSectionTitle({ colors, title }: ProfileSectionTitleProps) {
  return (
    <Text
      style={{
        fontSize: 12,
        fontWeight: '600',
        color: colors.textMuted,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      {title}
    </Text>
  );
}

