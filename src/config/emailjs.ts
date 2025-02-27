import emailjs from '@emailjs/browser';

// Initialize EmailJS with your user ID
export const initEmailJS = () => {
  // Use environment variables if available, otherwise use a default public key
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'user_7XPXNNf0XZGqKzRU2xg1L';
  emailjs.init(publicKey);
};

// Export a function to send the Hype Audit form data
export const sendHypeAuditEmail = async (formData: {
  storeName: string;
  email: string;
  phone: string;
  instagramHandle: string;
  tiktokHandle: string;
  website: string;
  currentChallenges: string;
}) => {
  // Use environment variables if available, otherwise use default values
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'blueprint_service';
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'hype_audit_template';
  
  return emailjs.send(
    serviceId,
    templateId,
    {
      to_email: 'create@blueprintstudios.tech',
      from_name: formData.storeName,
      from_email: formData.email,
      phone: formData.phone || 'Not provided',
      instagram: formData.instagramHandle,
      tiktok: formData.tiktokHandle || 'Not provided',
      website: formData.website,
      challenges: formData.currentChallenges || 'Not provided',
    }
  );
};
