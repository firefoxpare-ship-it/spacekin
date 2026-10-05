import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, LeaderboardEntry, ServerRole } from '../types';

export const ADMIN_EMAIL = 'firefox.pare@gmail.com';

export function isUserAdminOrOwner(email?: string | null, role?: string): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === ADMIN_EMAIL.toLowerCase() || cleanEmail === 'firefox.pare.@gmail.com') return true;
  return role === 'Owner' || role === 'Admin' || role === 'Sr Mod';
}

/**
 * Sync user profile to Firestore upon Google Sign-In
 */
export async function syncUserProfile(user: User, minecraftUsername?: string): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const path = `users/${user.uid}`;
  
  try {
    const existingSnap = await getDoc(userRef);
    const cleanUserEmail = user.email?.trim().toLowerCase();
    const isOwnerAccount = cleanUserEmail === ADMIN_EMAIL.toLowerCase() || cleanUserEmail === 'firefox.pare.@gmail.com';
    
    let profile: UserProfile;

    if (existingSnap.exists()) {
      const data = existingSnap.data() as UserProfile;
      const updatedRole = isOwnerAccount ? 'Owner' : data.role || 'Player';

      profile = {
        ...data,
        displayName: user.displayName || data.displayName || 'Space Explorer',
        photoURL: user.photoURL || data.photoURL || '',
        minecraftUsername: minecraftUsername || data.minecraftUsername || user.displayName?.replace(/\s+/g, '_') || 'Player',
        role: updatedRole,
        lastLoginAt: new Date().toISOString()
      };

      await updateDoc(userRef, {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        minecraftUsername: profile.minecraftUsername,
        role: profile.role,
        lastLoginAt: profile.lastLoginAt
      });
    } else {
      profile = {
        userId: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Player',
        photoURL: user.photoURL || '',
        minecraftUsername: minecraftUsername || user.displayName?.replace(/\s+/g, '_') || 'Player',
        role: isOwnerAccount ? 'Owner' : 'Player',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      await setDoc(userRef, profile);
    }

    // If owner or admin, also ensure admins/{uid} document exists for security rules
    if (isOwnerAccount || profile.role === 'Owner' || profile.role === 'Admin') {
      try {
        await setDoc(doc(db, 'admins', user.uid), {
          adminId: user.uid,
          email: user.email || '',
          role: profile.role,
          grantedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Could not update admins collection:', err);
      }
    }

    return profile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Fetch a single user's profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Real-time listener for all users (Admin view)
 */
export function subscribeToUsers(
  onData: (users: UserProfile[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = 'users';
  const q = query(collection(db, 'users'));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        users.push(docSnap.data() as UserProfile);
      });
      // Sort: Staff first, then by lastLoginAt desc
      const roleOrder: Record<string, number> = {
        Owner: 1,
        Admin: 2,
        'Sr Mod': 3,
        Mod: 4,
        Helper: 5,
        VIP: 6,
        Player: 7
      };
      users.sort((a, b) => {
        const orderA = roleOrder[a.role] || 99;
        const orderB = roleOrder[b.role] || 99;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.lastLoginAt || 0).getTime() - new Date(a.lastLoginAt || 0).getTime();
      });
      onData(users);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      if (onError) onError(error);
    }
  );
}

/**
 * Admin manually creates a user / staff member with username and role
 */
export async function manuallyAddUser(userData: {
  minecraftUsername: string;
  email?: string;
  role: ServerRole;
  displayName?: string;
}): Promise<void> {
  const cleanUsername = userData.minecraftUsername.trim();
  const customId = 'manual_' + cleanUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const path = `users/${customId}`;

  const emailToUse = userData.email?.trim() || `${cleanUsername.toLowerCase()}@spacekin.mc`;

  const newProfile: UserProfile = {
    userId: customId,
    email: emailToUse,
    displayName: userData.displayName?.trim() || cleanUsername,
    minecraftUsername: cleanUsername,
    role: userData.role,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    isManualEntry: true
  };

  try {
    await setDoc(doc(db, 'users', customId), newProfile);

    // If staff role, also save to admins registry
    if (['Owner', 'Admin', 'Sr Mod'].includes(userData.role)) {
      await setDoc(doc(db, 'admins', customId), {
        adminId: customId,
        email: emailToUse,
        role: userData.role,
        grantedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Admin updates a user's role
 */
export async function updateUserRole(userId: string, newRole: ServerRole, userEmail?: string): Promise<void> {
  const path = `users/${userId}`;
  try {
    await updateDoc(doc(db, 'users', userId), {
      role: newRole
    });

    if (['Owner', 'Admin', 'Sr Mod'].includes(newRole)) {
      await setDoc(doc(db, 'admins', userId), {
        adminId: userId,
        email: userEmail || '',
        role: newRole,
        grantedAt: new Date().toISOString()
      });
    } else {
      try {
        await deleteDoc(doc(db, 'admins', userId));
      } catch {
        // Ignored if document didn't exist
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Admin deletes a user record
 */
export async function deleteUser(userId: string): Promise<void> {
  const path = `users/${userId}`;
  try {
    await deleteDoc(doc(db, 'users', userId));
    try {
      await deleteDoc(doc(db, 'admins', userId));
    } catch {
      // Ignored
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Real-time listener for leaderboard entries by gameMode
 * STRICT: Only returns actual entries saved to Firestore database by Admins.
 * NO mock or fake default champions are injected.
 */
export function subscribeToLeaderboard(
  gameMode: string,
  onData: (entries: LeaderboardEntry[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = 'leaderboards';
  const q = query(collection(db, 'leaderboards'), where('gameMode', '==', gameMode));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: LeaderboardEntry[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as LeaderboardEntry;
        // Never include fake auto-generated IDs or mock defaults
        if (!d.id.startsWith('default_')) {
          list.push({ ...data, id: d.id });
        }
      });
      // Sort by admin-assigned rankPosition (1st, 2nd, 3rd, ...), fallback to kills descending
      list.sort((a, b) => {
        const rankA = a.rankPosition != null ? a.rankPosition : 9999;
        const rankB = b.rankPosition != null ? b.rankPosition : 9999;
        if (rankA !== rankB) {
          return rankA - rankB;
        }
        return (b.kills || 0) - (a.kills || 0);
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      if (onError) onError(error);
    }
  );
}

/**
 * Admin adds or updates a leaderboard player entry
 */
export async function saveLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id'> & { id?: string }): Promise<void> {
  const cleanUsername = entry.username.trim();
  const entryId = entry.id || `${entry.gameMode}_${cleanUsername.toLowerCase().replace(/[^a-z0-9_]/g, '')}`;
  const path = `leaderboards/${entryId}`;

  const payload: LeaderboardEntry = {
    id: entryId,
    username: cleanUsername,
    gameMode: entry.gameMode,
    rankPosition: Number(entry.rankPosition) || 1,
    kills: Number(entry.kills) || 0,
    deaths: Number(entry.deaths) || 0,
    score: 0,
    prestige: 1,
    rankTag: 'Player',
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'leaderboards', entryId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Admin deletes a leaderboard player entry
 */
export async function deleteLeaderboardEntry(id: string): Promise<void> {
  const path = `leaderboards/${id}`;
  try {
    await deleteDoc(doc(db, 'leaderboards', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Admin utility to purge/delete all leaderboard entries
 * Can be used by admin to wipe any previously seeded fake entries
 */
export async function clearAllLeaderboardEntries(gameMode?: string): Promise<number> {
  if (!auth.currentUser || !isUserAdminOrOwner(auth.currentUser.email)) {
    throw new Error('Unauthorized');
  }

  const path = 'leaderboards';
  try {
    const q = gameMode
      ? query(collection(db, 'leaderboards'), where('gameMode', '==', gameMode))
      : query(collection(db, 'leaderboards'));
    const snap = await getDocs(q);
    let count = 0;
    for (const docSnap of snap.docs) {
      await deleteDoc(doc(db, 'leaderboards', docSnap.id));
      count++;
    }
    return count;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Deprecated no-op: Fake auto-seeding removed as per user request.
 */
export async function seedBoxPvpLeaderboardIfEmpty(): Promise<void> {
  // No-op: strictly only admin entries are displayed
}
