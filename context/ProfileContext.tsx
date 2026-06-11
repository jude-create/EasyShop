import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateEmail as updateFirebaseEmail,
  updateProfile as updateFirebaseProfile,
} from '@react-native-firebase/auth';
import {
  createProfile,
  fetchProfileByUid,
  isAvatarLocalUri,
  type UserProfile,
  updateProfile as updateStrapiProfile,
  uploadProfileAvatar,
} from '../lib/profileApi';
import { registerForPushNotificationsAsync } from '../lib/notifications';

interface ProfileContextValue {
  profile: UserProfile | null;
  authLoading: boolean;
  profileLoading: boolean;
  savingProfile: boolean;
  pushToken: string | null;
  notificationStatus: string | null;
  refreshProfile: () => Promise<void>;
  refreshPushNotifications: () => Promise<string | null>;
  saveProfile: (next: Partial<UserProfile>) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const EMPTY_PROFILE: UserProfile = {
  firebaseUid: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  dob: '',
  avatarUrl: null,
};

const getProfileStorageKey = (firebaseUid: string) => `profile:${firebaseUid}`;

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  authLoading: true,
  profileLoading: false,
  savingProfile: false,
  pushToken: null,
  notificationStatus: null,
  refreshProfile: async () => {},
  refreshPushNotifications: async () => null,
  saveProfile: async () => {},
  signOutUser: async () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const auth = getAuth(getApp());
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const pushRegistrationRef = useRef<Promise<string | null> | null>(null);

  const refreshPushNotifications = useCallback(async () => {
    if (pushRegistrationRef.current) {
      return pushRegistrationRef.current;
    }

    pushRegistrationRef.current = registerForPushNotificationsAsync()
      .then((result) => {
        setPushToken(result.token);
        setNotificationStatus(result.status);

        if (__DEV__) {
          console.log('[notifications] registration result', result);
        }

        return result.token;
      })
      .finally(() => {
        pushRegistrationRef.current = null;
      });

    return pushRegistrationRef.current;
  }, []);

  const hydrateProfile = useCallback(
    async (firebaseUser: typeof auth.currentUser) => {
      if (!firebaseUser) {
        setProfile(null);
        setPushToken(null);
        setNotificationStatus(null);
        setProfileLoading(false);
        return;
      }

      // Hydrate from Firebase first so the UI can render immediately, then merge Strapi data if it exists.
      setProfileLoading(true);
      const baseProfile: UserProfile = {
        ...EMPTY_PROFILE,
        firebaseUid: firebaseUser.uid,
        firstName: firebaseUser.displayName?.split(' ')[0] || '',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        email: firebaseUser.email || '',
        phone: firebaseUser.phoneNumber || '',
        address: '',
        avatarUrl: firebaseUser.photoURL || null,
      };

      try {
        const cachedProfile = await AsyncStorage.getItem(getProfileStorageKey(firebaseUser.uid));
        if (cachedProfile) {
          try {
            setProfile({ ...baseProfile, ...JSON.parse(cachedProfile) });
          } catch {
            setProfile(baseProfile);
          }
        } else {
          setProfile(baseProfile);
        }

        const existing = await fetchProfileByUid(firebaseUser.uid);
        if (existing) {
          let nextProfile = { ...baseProfile, ...existing };
          setProfile(nextProfile);
          AsyncStorage.setItem(getProfileStorageKey(firebaseUser.uid), JSON.stringify(nextProfile)).catch(() => {});

          const nextPushToken = await refreshPushNotifications();
          if (nextPushToken && nextProfile.expoPushToken !== nextPushToken) {
            try {
              nextProfile = await updateStrapiProfile({
                ...nextProfile,
                expoPushToken: nextPushToken,
              });
              setProfile(nextProfile);
              AsyncStorage.setItem(getProfileStorageKey(firebaseUser.uid), JSON.stringify(nextProfile)).catch(() => {});
            } catch {
              setProfile({ ...nextProfile, expoPushToken: nextPushToken });
              AsyncStorage.setItem(
                getProfileStorageKey(firebaseUser.uid),
                JSON.stringify({ ...nextProfile, expoPushToken: nextPushToken }),
              ).catch(() => {});
            }
          }

          return;
        }

        let nextProfile = await createProfile(baseProfile);
        setProfile(nextProfile);
        AsyncStorage.setItem(getProfileStorageKey(firebaseUser.uid), JSON.stringify(nextProfile)).catch(() => {});

        const nextPushToken = await refreshPushNotifications();
        if (nextPushToken && nextProfile.expoPushToken !== nextPushToken) {
          try {
            nextProfile = await updateStrapiProfile({
              ...nextProfile,
              expoPushToken: nextPushToken,
            });
            setProfile(nextProfile);
            AsyncStorage.setItem(getProfileStorageKey(firebaseUser.uid), JSON.stringify(nextProfile)).catch(() => {});
          } catch {
            setProfile({ ...nextProfile, expoPushToken: nextPushToken });
            AsyncStorage.setItem(
              getProfileStorageKey(firebaseUser.uid),
              JSON.stringify({ ...nextProfile, expoPushToken: nextPushToken }),
            ).catch(() => {});
          }
        }
      } catch {
        // Fall back to Firebase-only info so the profile screen still renders.
        setProfile(baseProfile);
        AsyncStorage.setItem(getProfileStorageKey(firebaseUser.uid), JSON.stringify(baseProfile)).catch(() => {});
      } finally {
        setProfileLoading(false);
      }
    },
    [refreshPushNotifications],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      try {
        await hydrateProfile(firebaseUser);
      } finally {
        setAuthLoading(false);
      }
    });

    return unsubscribe;
  }, [auth, hydrateProfile]);

  const refreshProfile = async () => {
    await hydrateProfile(auth.currentUser);
  };

  const saveProfile = async (next: Partial<UserProfile>) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setSavingProfile(true);
    try {
      // Merge the current profile, Firebase auth values, and the user's edits into one payload.
      const merged: UserProfile = {
        ...EMPTY_PROFILE,
        firebaseUid: currentUser.uid,
        firstName: profile?.firstName || currentUser.displayName?.split(' ')[0] || '',
        lastName: profile?.lastName || currentUser.displayName?.split(' ').slice(1).join(' ') || '',
        email: profile?.email || currentUser.email || '',
        phone: profile?.phone || currentUser.phoneNumber || '',
        address: profile?.address || '',
        dob: profile?.dob || '',
        avatarUrl: profile?.avatarUrl || currentUser.photoURL || null,
        expoPushToken: profile?.expoPushToken || null,
        ...profile,
        ...next,
      };

      if (merged.avatarUrl && isAvatarLocalUri(merged.avatarUrl)) {
        try {
          const uploadedAvatarUrl = await uploadProfileAvatar(merged.avatarUrl);
          merged.avatarUrl = uploadedAvatarUrl;
          await updateFirebaseProfile(currentUser, { photoURL: uploadedAvatarUrl });
        } catch {
          // If upload fails, keep the current profile image state and continue saving the rest.
          merged.avatarUrl = profile?.avatarUrl || currentUser.photoURL || null;
        }
      } else if (merged.avatarUrl === null) {
        await updateFirebaseProfile(currentUser, { photoURL: null });
      }

      const fullName = `${merged.firstName} ${merged.lastName}`.trim();
      if (fullName) {
        await updateFirebaseProfile(currentUser, { displayName: fullName });
      }

      if (merged.email && merged.email !== currentUser.email) {
        try {
          await updateFirebaseEmail(currentUser, merged.email);
        } catch {
          // Email may require recent-login reauthentication; Strapi profile still saves below.
        }
      }

      try {
        const saved = merged.id
          ? await updateStrapiProfile(merged)
          : await createProfile(merged);

        setProfile({
          ...saved,
          email: saved.email || currentUser.email || '',
          avatarUrl: saved.avatarUrl ?? currentUser.photoURL ?? null,
        });
        AsyncStorage.setItem(
          getProfileStorageKey(currentUser.uid),
          JSON.stringify({
            ...saved,
            email: saved.email || currentUser.email || '',
            avatarUrl: saved.avatarUrl ?? currentUser.photoURL ?? null,
          }),
        ).catch(() => {});
      } catch {
        setProfile(merged);
        AsyncStorage.setItem(getProfileStorageKey(currentUser.uid), JSON.stringify(merged)).catch(() => {});
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const signOutUser = async () => {
    const currentUid = auth.currentUser?.uid;
    await signOut(auth);
    if (currentUid) {
      AsyncStorage.removeItem(getProfileStorageKey(currentUid)).catch(() => {});
    }
    setProfile(null);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        authLoading,
        profileLoading,
        savingProfile,
        pushToken,
        notificationStatus,
        refreshProfile,
        refreshPushNotifications,
        saveProfile,
        signOutUser,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
