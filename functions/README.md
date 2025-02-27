# Form Notification Functions

This directory contains Firebase Cloud Functions that send email notifications when new forms are submitted.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your actual credentials

3. Set Firebase Functions configuration:
   ```
   firebase functions:config:set email.password="your_email_password_here"
   ```

## Deployment

Deploy the functions to Firebase:
```
firebase deploy --only functions
```

## Functions

### sendFormNotification

This function sends an email notification when a new form is submitted to the Firestore `forms` collection. The email content is customized based on the form type:

- `hype-audit`: Sends a notification with details from the Hype Audit form
- `quote-request`: Sends a notification with details from the Quote Request form

## Email Configuration

The function uses Nodemailer with Gmail to send emails. If you're using Gmail, you might need to:

1. Enable "Less secure app access" in your Google account settings, or
2. Create an "App Password" if you have 2-factor authentication enabled

For production use, consider using a dedicated email service like SendGrid or Mailgun.
