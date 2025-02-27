import emailjs from '@emailjs/browser';

// Initialize EmailJS with your user ID
export const initEmailJS = () => {
  emailjs.init('YOUR_USER_ID'); // Replace with your EmailJS User ID
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
  return emailjs.send(
    'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
    'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
    {
      to_email: 'create@blueprintstudios.tech',
      from_name: formData.storeName,
      from_email: formData.email,
      phone: formData.phone,
      instagram: formData.instagramHandle,
      tiktok: formData.tiktokHandle,
      website: formData.website,
      challenges: formData.currentChallenges,
    }
  );
};
