# Setting Up EmailJS for Hype Audit Form

This application uses EmailJS to send form data from the Hype Audit form to create@blueprintstudios.tech. Follow these steps to set up EmailJS:

## 1. Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and sign up for an account
2. Verify your email address

## 2. Create an Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Name your service (e.g., "blueprint-service")
6. Note down the **Service ID**

## 3. Create an Email Template

1. In your EmailJS dashboard, go to "Email Templates"
2. Click "Create New Template"
3. Design your email template with the following variables:
   - `{{to_email}}` - The recipient email (create@blueprintstudios.tech)
   - `{{from_name}}` - The store name
   - `{{from_email}}` - The user's email
   - `{{phone}}` - The user's phone number
   - `{{instagram}}` - The user's Instagram handle
   - `{{tiktok}}` - The user's TikTok handle
   - `{{website}}` - The user's website URL
   - `{{challenges}}` - The user's marketing challenges
4. Save the template
5. Note down the **Template ID**

## 4. Get Your User ID

1. In your EmailJS dashboard, go to "Account"
2. Find your **User ID** (also called Public Key)

## 5. Update the Application Configuration

1. Open `src/config/emailjs.ts`
2. Replace `YOUR_USER_ID` with your EmailJS User ID
3. Replace `YOUR_SERVICE_ID` with your EmailJS Service ID
4. Replace `YOUR_TEMPLATE_ID` with your EmailJS Template ID

```typescript
// Initialize EmailJS with your user ID
export const initEmailJS = () => {
  emailjs.init('YOUR_USER_ID'); // Replace with your EmailJS User ID
};

// Export a function to send the Hype Audit form data
export const sendHypeAuditEmail = async (formData: {
  // ...
}) => {
  return emailjs.send(
    'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
    'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
    {
      // ...
    }
  );
};
```

## 6. Test the Form

1. Fill out the Hype Audit form
2. Submit the form
3. Check that the email is sent to create@blueprintstudios.tech

## Troubleshooting

- If emails are not being sent, check the browser console for errors
- Verify that your EmailJS account is active and has available email credits
- Ensure that your email service is properly connected
- Check that all IDs (User ID, Service ID, Template ID) are correctly entered in the configuration file
