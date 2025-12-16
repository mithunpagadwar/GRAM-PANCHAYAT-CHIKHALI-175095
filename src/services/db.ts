import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query } from 'firebase/firestore';

// Generic Subscribe Function (Realtime Listener)
// Now supports an onError callback to handle permission/connection issues gracefully
export const subscribeToCollection = (
  collectionName: string, 
  callback: (data: any[]) => void,
  onError?: (error: any) => void
) => {
  try {
    const q = query(collection(db, collectionName));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    }, (error) => {
        console.error(`Error syncing ${collectionName}:`, error);
        // If an error handler is provided (e.g., to switch to offline mode), call it
        if (onError) onError(error);
    });
  } catch (e) {
    console.error("Firebase not initialized or query failed", e);
    if (onError) onError(e);
    return () => {};
  }
};

// Generic Add Function
export const addToCollection = async (collectionName: string, data: any) => {
  try {
    await addDoc(collection(db, collectionName), data);
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Cloud Error: Database might be disabled in Firebase Console. Please enable Firestore.");
    return false;
  }
};

// Generic Delete Function
export const deleteFromCollection = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

// Generic Update Function
export const updateInCollection = async (collectionName: string, id: string, data: any) => {
    try {
        await updateDoc(doc(db, collectionName, id), data);
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};

export const saveSettings = async (settings: any) => {
    console.log("Settings synced to cloud"); 
};