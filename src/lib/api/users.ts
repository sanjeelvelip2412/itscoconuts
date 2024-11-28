import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  accountType: 'buyer' | 'seller';
  createdAt: string;
}

export async function createUser(userId: string, userData: UserData) {
  try {
    await setDoc(doc(db, 'users', userId), userData);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUser(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function updateUser(userId: string, userData: Partial<UserData>) {
  try {
    await updateDoc(doc(db, 'users', userId), userData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}