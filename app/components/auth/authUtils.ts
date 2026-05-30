import { darkColors, lightColors } from '../../context/ThemeContext';

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface SignUpFormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
}

export interface SignUpFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLogin = (
  email: string,
  password: string,
): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

export const validateSignUp = (form: SignUpFormState): SignUpFormErrors => {
  const errors: SignUpFormErrors = {};

  if (!form.name.trim()) {
    errors.name = 'Full name is required';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (form.phone.trim().replace(/\D/g, '').length < 10) {
    errors.phone = 'Enter a valid phone number';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = 'Must include at least one uppercase letter';
  } else if (!/[0-9]/.test(form.password)) {
    errors.password = 'Must include at least one number';
  }

  if (!form.confirm) {
    errors.confirm = 'Please confirm your password';
  } else if (form.confirm !== form.password) {
    errors.confirm = 'Passwords do not match';
  }

  return errors;
};

export const getPasswordStrength = (password: string, darkMode = false) => {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { label: 'Weak', color: darkMode ? darkColors.danger : lightColors.danger, width: '25%' };
  }
  if (score === 2) return { label: 'Fair', color: '#F59E0B', width: '50%' };
  if (score === 3) return { label: 'Good', color: '#3B82F6', width: '75%' };
  return { label: 'Strong', color: darkMode ? darkColors.green : lightColors.green, width: '100%' };
};

