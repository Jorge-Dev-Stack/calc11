import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const saveUserToFirestore = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    lastSignIn: new Date().toISOString(),
  }, { merge: true });
};