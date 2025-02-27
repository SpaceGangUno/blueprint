const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure nodemailer with your email service
// For Gmail, you might need to use an "App Password" instead of your regular password
// See: https://support.google.com/accounts/answer/185833
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'create@blueprintstudios.tech', // Replace with your email
    pass: functions.config().email?.password || process.env.EMAIL_PASSWORD // Get from Firebase Functions config or local env
  }
});

/**
 * Cloud Function that sends an email notification when a new form is submitted
 */
exports.sendFormNotification = functions.firestore
  .document('forms/{formId}')
  .onCreate(async (snapshot, context) => {
    try {
      // Get the form data
      const formData = snapshot.data();
      const formId = context.params.formId;
      const formType = formData.formType;
      
      // Prepare email content based on form type
      let subject, html;
      
      if (formType === 'hype-audit') {
        subject = `New Hype Audit Request from ${formData.storeName}`;
        html = `
          <h2>New Hype Audit Request</h2>
          <p><strong>Store Name:</strong> ${formData.storeName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
          <p><strong>Instagram:</strong> ${formData.instagramHandle}</p>
          <p><strong>TikTok:</strong> ${formData.tiktokHandle || 'Not provided'}</p>
          <p><strong>Website:</strong> ${formData.website}</p>
          <p><strong>Challenges:</strong> ${formData.currentChallenges || 'Not provided'}</p>
          <p><strong>Submitted At:</strong> ${new Date(formData.submittedAt.toDate()).toLocaleString()}</p>
          <p><a href="https://console.firebase.google.com/project/blueprint-st/firestore/data/forms/${formId}">View in Firebase Console</a></p>
        `;
      } else if (formType === 'quote-request') {
        subject = `New Quote Request from ${formData.name}`;
        html = `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
          <p><strong>Services:</strong> ${formData.services.join(', ')}</p>
          <p><strong>Budget:</strong> ${formData.budget}</p>
          <p><strong>Timeline:</strong> ${formData.timeline}</p>
          <p><strong>Description:</strong> ${formData.description}</p>
          <p><strong>Submitted At:</strong> ${new Date(formData.submittedAt.toDate()).toLocaleString()}</p>
          <p><a href="https://console.firebase.google.com/project/blueprint-st/firestore/data/forms/${formId}">View in Firebase Console</a></p>
        `;
      } else {
        subject = `New Form Submission`;
        html = `
          <h2>New Form Submission</h2>
          <p><strong>Form Type:</strong> ${formType}</p>
          <p><strong>Form ID:</strong> ${formId}</p>
          <p><strong>Submitted At:</strong> ${new Date(formData.submittedAt.toDate()).toLocaleString()}</p>
          <p><a href="https://console.firebase.google.com/project/blueprint-st/firestore/data/forms/${formId}">View in Firebase Console</a></p>
        `;
      }
      
      // Send email notification
      const mailOptions = {
        from: 'Blueprint Studios <create@blueprintstudios.tech>',
        to: 'create@blueprintstudios.tech', // Replace with recipient email
        subject: subject,
        html: html
      };
      
      await transporter.sendMail(mailOptions);
      
      console.log(`Email notification sent for form submission: ${formId}`);
      return null;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return null;
    }
  });
