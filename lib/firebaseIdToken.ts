import { getApp } from '@react-native-firebase/app';
import { getAuth, getIdToken } from '@react-native-firebase/auth';

export async function getFirebaseIdToken(): Promise<string | null> {
  const user = getAuth(getApp()).currentUser;
  if (!user) return null;

  try {
    return await getIdToken(user);
  } catch {
    return null;
  }
}
