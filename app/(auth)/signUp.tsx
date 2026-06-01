import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import AuthScreen from '../../components/auth/AuthScreen';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthField from '../../components/auth/AuthField';
import AuthButton from '../../components/auth/AuthButton';
import AuthCheckbox from '../../components/auth/AuthCheckbox';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import {
  getPasswordStrength,
  validateSignUp,
  type SignUpFormErrors,
  type SignUpFormState,
} from '../../components/auth/authUtils';
import { registerWithEmail, loginWithGoogle } from '../../components/auth/googleAuth';
import { Alert } from 'react-native';



const EMPTY: SignUpFormState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirm: '',
};

type FieldDef = {
  key: keyof SignUpFormState;
  label: string;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboard?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  secure?: boolean;
};

const FIELDS: FieldDef[] = [
  { key: 'name', label: 'Full Name', placeholder: 'John Doe', icon: 'person-outline' },
  { key: 'email', label: 'Email', placeholder: 'you@example.com', icon: 'mail-outline', keyboard: 'email-address' },
  { key: 'phone', label: 'Phone Number', placeholder: '+234 800 000 0000', icon: 'call-outline', keyboard: 'phone-pad' },
  { key: 'password', label: 'Password', placeholder: '••••••••', icon: 'lock-closed-outline', secure: true },
  { key: 'confirm', label: 'Confirm Password', placeholder: '••••••••', icon: 'shield-checkmark-outline', secure: true },
];

export default function SignUpScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [form, setForm] = useState<SignUpFormState>(EMPTY);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const update = (key: keyof SignUpFormState, value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setErrors(validateSignUp(next));
  };

 const handleSignUp = async () => {
  setSubmitted(true);
  const nextErrors = validateSignUp(form);
  setErrors(nextErrors);
  if (Object.keys(nextErrors).length > 0 || !agreed) return;

  setLoading(true);
  try {
    await registerWithEmail(form.email, form.password);
    router.replace('/(tabs)/home');
  } catch (e: any) {
    Alert.alert('Sign up failed', e.message);
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSuccess = async () => {
    try {
      await loginWithGoogle();
      router.replace('/(tabs)/home');
    } catch (e: any) {
      Alert.alert('Google sign-up failed', e.message);
    }
  };

  const passwordStrength = getPasswordStrength(form.password, isDark);
  const checkboxError = submitted && !agreed ? 'You must agree to the terms to continue' : undefined;

  return (
    <AuthScreen backgroundColor={colors.primary} contentBackgroundColor={colors.background}>
      <AuthHeader
        colors={colors}
        title="Create Account"
        subtitle="Join CW Retail today"
        icon="person-add-outline"
        align="left"
        showBackButton
        onBack={() => router.back()}
      />

      <View style={{ padding: 24 }}>
        {FIELDS.map((field) => {
          const hasError = !!errors[field.key];
          const isSuccessful = submitted && !hasError && form[field.key].length > 0;
          const isPasswordField = field.key === 'password';
          const isConfirmField = field.key === 'confirm';
          const secureState = isConfirmField ? showConfirm : showPw;

          return (
            <View key={field.key}>
              <AuthField
                colors={colors}
                label={field.label}
                value={form[field.key]}
                error={errors[field.key]}
                icon={field.icon}
                placeholder={field.placeholder}
                keyboardType={field.keyboard}
                autoCapitalize={field.key === 'name' ? 'words' : 'none'}
                secureTextEntry={field.secure ? !secureState : undefined}
                showSecureToggle={field.secure}
                onToggleSecure={() =>
                  isConfirmField
                    ? setShowConfirm((current) => !current)
                    : setShowPw((current) => !current)
                }
                onChangeText={(value) => update(field.key, value)}
                fieldIsFocused={focusedField === field.key}
                onFocus={() => setFocusedField(field.key)}
                onBlur={() => {
                  setFocusedField(null);
                  if (submitted) setErrors(validateSignUp(form));
                }}
                showSuccess={isSuccessful}
              />

              {isPasswordField && form.password.length > 0 && passwordStrength && (
                <View style={{ marginTop: -2, marginBottom: 10 }}>
                  <View
                    style={{
                      height: 4,
                      backgroundColor: colors.subtle,
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        height: 4,
                        width: passwordStrength.width,
                        backgroundColor: passwordStrength.color,
                        borderRadius: 4,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: passwordStrength.color,
                      marginTop: 3,
                      fontWeight: '600',
                    }}
                  >
                    {passwordStrength.label} password
                  </Text>
                </View>
              )}

              {isConfirmField && form.confirm.length > 0 && !errors.confirm && form.confirm === form.password && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: -6, marginBottom: 10 }}>
                  <Ionicons name="checkmark-circle" size={13} color={colors.green} />
                  <Text style={{ fontSize: 12, color: colors.green }}>Passwords match</Text>
                </View>
              )}
            </View>
          );
        })}

        <AuthCheckbox
          checked={agreed}
          onPress={() => {
            const next = !agreed;
            setAgreed(next);
            if (submitted) setErrors(validateSignUp(form));
          }}
          colors={colors}
          error={checkboxError}
        >
          I agree to the{' '}
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
        </AuthCheckbox>

        <AuthButton
          label="Create Account"
          loading={loading}
          onPress={handleSignUp}
          primaryColor={colors.primary}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 18, marginBottom: 4 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          <Text style={{ marginHorizontal: 10, fontSize: 12, color: colors.textSecondary, fontWeight: '600' }}>
            OR
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        </View>

        <GoogleAuthButton
          colors={{
            card: colors.card,
            borderStrong: colors.borderStrong,
            text: colors.text,
            textMuted: colors.textMuted,
          }}
          onSuccess={handleGoogleSuccess}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '700' }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthScreen>
  );
}
