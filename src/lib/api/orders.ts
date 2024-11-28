import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface Order {
  id?: string;
  userId: string;
  buyerName: string;
  buyerEmail: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  pincode: string;
  paymentMethod: 'cod' | 'payu';
  createdAt: string;
  sellerId: string;
}

export async function createOrder(orderData: Omit<Order, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getSellerOrders(sellerId: string) {
  try {
    const q = query(collection(db, 'orders'), where('sellerId', '==', sellerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error getting seller orders:', error);
    throw error;
  }
}

export async function getUserOrders(userId: string) {
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
}

export async function getOrder(orderId: string) {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    if (orderDoc.exists()) {
      return { id: orderDoc.id, ...orderDoc.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
}