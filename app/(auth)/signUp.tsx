import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AuthScreen from '../../components/auth/AuthScreen';
import AuthHeader from '../../components/auth/AuthHeader';
import SignUpForm from '../../components/auth/SignUpForm';
import { validateSignUp, type SignUpFormErrors, type SignUpFormState } from '../../components/auth/authUtils';
import { registerWithEmail, loginWithGoogle, logout, getCurrentUser } from '../../components/auth/googleAuth';
import { useProfile } from '../../context/ProfileContext';

const EMPTY: SignUpFormState = { name: '', email: '', phone: '', password: '', confirm: '' };

export default function SignUpScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { saveProfile } = useProfile();
  const [form, setForm] = useState<SignUpFormState>(EMPTY);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
      if (getCurrentUser()) {
        await logout();
      }

      await registerWithEmail(form.email, form.password);
      const [firstName = '', ...rest] = form.name.trim().split(' ');
      await saveProfile({
        firstName,
        lastName: rest.join(' '),
        email: form.email,
        phone: form.phone,
        address: '',
        dob: '',
        avatarUrl: null,
      });
    } catch (e: any) {
      Alert.alert('Sign up failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async () => {
    try {
      await loginWithGoogle();
    } catch (e: any) {
      Alert.alert('Google sign-up failed', e.message);
    }
  };

  return (
    <AuthScreen backgroundColor={colors.primary} contentBackgroundColor={colors.background} loading={loading || googleLoading} loadingLabel="Creating your account...">
      <AuthHeader colors={colors} title="Create Account" subtitle="Join CW Retail today" icon="person-add-outline" align="left" showBackButton onBack={() => router.back()} />
      <SignUpForm
        colors={colors}
        isDark={isDark}
        form={form}
        errors={errors}
        submitted={submitted}
        agreed={agreed}
        loading={loading}
        focusedField={focusedField}
        showPw={showPw}
        showConfirm={showConfirm}
        onUpdate={update}
        onToggleAgreed={() => {
          const next = !agreed;
          setAgreed(next);
          if (submitted) setErrors(validateSignUp(form));
        }}
        onCreateAccount={handleSignUp}
        onGoogleSuccess={handleGoogleSuccess}
        onTogglePassword={() => setShowPw((current) => !current)}
        onToggleConfirm={() => setShowConfirm((current) => !current)}
        onFocusField={setFocusedField}
        onBackToSignIn={() => router.back()}
        onGoogleLoadingChange={setGoogleLoading}
      />
    </AuthScreen>
  );
}
