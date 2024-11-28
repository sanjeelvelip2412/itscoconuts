import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sellerId: string;
  category?: string;
  stock: number;
  pincode: string;
  createdAt: string;
}

export async function addProduct(productData: Omit<Product, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'products'), productData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function getProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
}

export async function getProductsByPincode(pincode: string) {
  try {
    const q = query(collection(db, 'products'), where('pincode', '==', pincode));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error getting products by pincode:', error);
    throw error;
  }
}

export async function getSellerProducts(sellerId: string) {
  try {
    const q = query(collection(db, 'products'), where('sellerId', '==', sellerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error getting seller products:', error);
    throw error;
  }
}

export async function updateProduct(productId: string, productData: Partial<Product>) {
  try {
    await updateDoc(doc(db, 'products', productId), productData);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}