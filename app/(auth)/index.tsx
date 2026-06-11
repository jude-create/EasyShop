import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AuthScreen from '../../components/auth/AuthScreen';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthField from '../../components/auth/AuthField';
import AuthButton from '../../components/auth/AuthButton';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import { validateLogin, type LoginFormErrors } from '../../components/auth/authUtils';
import { loginWithEmail, loginWithGoogle } from '../../components/auth/googleAuth';



export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (submitted) setErrors(validateLogin(value, password));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (submitted) setErrors(validateLogin(email, value));
  };

  const handleLogin = async () => {
  setSubmitted(true);
  const nextErrors = validateLogin(email, password);
  setErrors(nextErrors);
  if (Object.keys(nextErrors).length > 0) return;

  setLoading(true);
  try {
    await loginWithEmail(email, password);
  } catch (e: any) {
    Alert.alert('Login failed', e.message);
  } finally {
    setLoading(false);
  }
};

const handleGoogleSuccess = async () => {
  try {
    await loginWithGoogle();
  } catch (e: any) {
    Alert.alert('Google sign-in failed', e.message);
  }
};

  

  return (
    <AuthScreen
      backgroundColor={colors.primary}
      contentBackgroundColor={colors.background}
      loading={loading || googleLoading}
      loadingLabel="Signing you in..."
    >
      <AuthHeader
        colors={colors}
        title="CW RETAIL"
        subtitle="E-commerce & Point-of-Sale Platform"
        icon="storefront"
        align="center"
      />

      <View style={{ padding: 24, flex: 1 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 6,
            letterSpacing: -0.3,
          }}
        >
          Welcome back
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 28 }}>
          Sign in to continue to your store
        </Text>

        <AuthField
          colors={colors}
          label="Email"
          value={email}
          error={errors.email}
          icon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
          onChangeText={handleEmailChange}
          fieldIsFocused={focusedField === 'email'}
          onFocus={() => setFocusedField('email')}
          onBlur={() => {
            setFocusedField(null);
            if (submitted) setErrors(validateLogin(email, password));
          }}
          showSuccess={submitted}
        />

        <AuthField
          colors={colors}
          label="Password"
          value={password}
          error={errors.password}
          icon="lock-closed-outline"
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          showSecureToggle
          onToggleSecure={() => setShowPassword((current) => !current)}
          onChangeText={handlePasswordChange}
          fieldIsFocused={focusedField === 'password'}
          onFocus={() => setFocusedField('password')}
          onBlur={() => {
            setFocusedField(null);
            if (submitted) setErrors(validateLogin(email, password));
          }}
          showSuccess={false}
        />

        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 28 }}>
          <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '500' }}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <AuthButton
          label="Sign In"
          loading={loading}
          onPress={handleLogin}
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
          onLoadingChange={setGoogleLoading}
        />

        <TouchableOpacity
          onPress={() => router.push('/(auth)/signUp')}
          style={{ alignItems: 'center', marginTop: 16 }}
        >
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            Don&apos;t have an account?{' '}
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthScreen>
  );
}
