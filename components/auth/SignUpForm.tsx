import { DimensionValue, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { AppColors } from '../../context/ThemeContext';
import AuthField from './AuthField';
import AuthButton from './AuthButton';
import AuthCheckbox from './AuthCheckbox';
import GoogleAuthButton from './GoogleAuthButton';
import { getPasswordStrength, type SignUpFormErrors, type SignUpFormState } from './authUtils';

// Keep the form structure declarative so the screen stays easy to scan and extend.
const FIELDS: {
  key: keyof SignUpFormState;
  label: string;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboard?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  secure?: boolean;
}[] = [
  { key: 'name', label: 'Full Name', placeholder: 'John Doe', icon: 'person-outline' },
  { key: 'email', label: 'Email', placeholder: 'you@example.com', icon: 'mail-outline', keyboard: 'email-address' },
  { key: 'phone', label: 'Phone Number', placeholder: '+234 800 000 0000', icon: 'call-outline', keyboard: 'phone-pad' },
  { key: 'password', label: 'Password', placeholder: '••••••••', icon: 'lock-closed-outline', secure: true },
  { key: 'confirm', label: 'Confirm Password', placeholder: '••••••••', icon: 'shield-checkmark-outline', secure: true },
];

interface SignUpFormProps {
  colors: AppColors;
  isDark: boolean;
  form: SignUpFormState;
  errors: SignUpFormErrors;
  submitted: boolean;
  agreed: boolean;
  loading: boolean;
  focusedField: string | null;
  showPw: boolean;
  showConfirm: boolean;
  onUpdate: (key: keyof SignUpFormState, value: string) => void;
  onToggleAgreed: () => void;
  onCreateAccount: () => void;
  onGoogleSuccess: () => void;
  onTogglePassword: () => void;
  onToggleConfirm: () => void;
  onFocusField: (field: string | null) => void;
  onBackToSignIn: () => void;
  onGoogleLoadingChange: (loading: boolean) => void;
}

export default function SignUpForm({
  colors,
  isDark,
  form,
  errors,
  submitted,
  agreed,
  loading,
  focusedField,
  showPw,
  showConfirm,
  onUpdate,
  onToggleAgreed,
  onCreateAccount,
  onGoogleSuccess,
  onTogglePassword,
  onToggleConfirm,
  onFocusField,
  onBackToSignIn,
  onGoogleLoadingChange,
}: SignUpFormProps) {
  const passwordStrength = getPasswordStrength(form.password, isDark);
  const checkboxError = submitted && !agreed ? 'You must agree to the terms to continue' : undefined;

  return (
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
              onToggleSecure={isConfirmField ? onToggleConfirm : onTogglePassword}
              onChangeText={(value) => onUpdate(field.key, value)}
              fieldIsFocused={focusedField === field.key}
              onFocus={() => onFocusField(field.key)}
              onBlur={() => onFocusField(null)}
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
                      width: passwordStrength.width as DimensionValue,
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

      <AuthCheckbox checked={agreed} onPress={onToggleAgreed} colors={colors} error={checkboxError}>
        I agree to the{' '}
        <Text style={{ color: colors.primary, fontWeight: '600' }}>Terms of Service</Text>
        {' '}and{' '}
        <Text style={{ color: colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
      </AuthCheckbox>

      <AuthButton label="Create Account" loading={loading} onPress={onCreateAccount} primaryColor={colors.primary} />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 18, marginBottom: 4 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        <Text style={{ marginHorizontal: 10, fontSize: 12, color: colors.textSecondary, fontWeight: '600' }}>OR</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
      </View>

      <GoogleAuthButton
        colors={{
          card: colors.card,
          borderStrong: colors.borderStrong,
          text: colors.text,
          textMuted: colors.textMuted,
        }}
        onSuccess={onGoogleSuccess}
        onLoadingChange={onGoogleLoadingChange}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: 16, marginBottom: 8 }}>
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>Already have an account?</Text>
        <TouchableOpacity onPress={onBackToSignIn}>
          <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '700' }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
