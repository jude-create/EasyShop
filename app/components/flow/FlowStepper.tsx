import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FlowStepperProps {
  colors: {
    primary: string;
    subtle: string;
    border: string;
    textMuted: string;
  };
  steps: string[];
  currentStep: number;
}

export default function FlowStepper({ colors, steps, currentStep }: FlowStepperProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
      {steps.map((step, index) => (
        <View key={step} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: index <= currentStep ? colors.primary : colors.subtle,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {index < currentStep ? (
                <Ionicons name="checkmark" size={14} color="white" />
              ) : (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: index === currentStep ? 'white' : colors.textMuted,
                  }}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 10,
                fontWeight: index === currentStep ? '700' : '400',
                color: index === currentStep ? colors.primary : colors.textMuted,
              }}
            >
              {step}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View
              style={{
                flex: 1,
                height: 1.5,
                backgroundColor: index < currentStep ? colors.primary : colors.border,
                marginHorizontal: 4,
                marginBottom: 14,
              }}
            />
          )}
        </View>
      ))}
    </View>
  );
}

