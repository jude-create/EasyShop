import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface GoogleAuthProfile {
  accessToken?: string;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
}

export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
}

export async function loginWithEmail(email: string, password: string) {
  const auth = getAuth(getApp());
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(email: string, password: string) {
  const auth = getAuth(getApp());
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function loginWithGoogle() {
  await GoogleSignin.hasPlayServices();
  const { data } = await GoogleSignin.signIn();
  const auth = getAuth(getApp());
  const credential = GoogleAuthProvider.credential(data?.idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

export async function logout() {
  const auth = getAuth(getApp());
  await signOut(auth);
}

export function getCurrentUser() {
  const auth = getAuth(getApp());
  return auth.currentUser;
}