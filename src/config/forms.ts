import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Interface for Hype Audit form data
export interface HypeAuditFormData {
  storeName: string;
  email: string;
  phone: string;
  instagramHandle: string;
  tiktokHandle?: string;
  website: string;
  currentChallenges?: string;
  submittedAt?: any;
}

// Interface for Quote Request form data
export interface QuoteRequestFormData {
  name: string;
  email: string;
  company?: string;
  description: string;
  services: string[];
  budget: string;
  timeline: string;
  submittedAt?: any;
}

// Submit Hype Audit form data to Firestore
export const submitHypeAuditForm = async (formData: HypeAuditFormData) => {
  try {
    // Use a single collection for all forms
    const formsRef = collection(db, 'forms');
    
    const docRef = await addDoc(formsRef, {
      ...formData,
      formType: 'hype-audit',
      submittedAt: serverTimestamp()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting hype audit form:', error);
    throw error;
  }
};

// Submit Quote Request form data to Firestore
export const submitQuoteRequestForm = async (formData: QuoteRequestFormData) => {
  try {
    // Use a single collection for all forms
    const formsRef = collection(db, 'forms');
    
    const docRef = await addDoc(formsRef, {
      ...formData,
      formType: 'quote-request',
      submittedAt: serverTimestamp()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting quote request form:', error);
    throw error;
  }
};
