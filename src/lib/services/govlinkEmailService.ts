import nodemailer from 'nodemailer';

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PW,
  },
});

// Verify transporter configuration
transporter.verify((error: Error | null) => {
  if (error) {
    console.error('Email service configuration error:', error);
  } else {
    console.log('GovLink email service is ready to send messages');
  }
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
  }>;
}

export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; message: string; messageId?: string; error?: string }> => {
  try {
    const mailOptions = {
      from: `"${process.env.GOV_SERVICE_NAME}" <${process.env.MAIL_ID}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      cc: Array.isArray(options.cc) ? options.cc.join(', ') : options.cc,
      bcc: Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
    };
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: 'Failed to send email',
      error: errorMessage,
    };
  }
};

// GovLink email templates for Sri Lankan government services
export const govLinkEmailTemplates = {
  // Welcome email for new citizens
  welcome: (name: string, userType: 'citizen' | 'agent' | 'admin') => ({
    subject: `Welcome to ${process.env.GOV_SERVICE_NAME} - Your Digital Government Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #FFC72C; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #1B365D 0%, #2E5F8A 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🇱🇰 ${process.env.GOV_SERVICE_NAME}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Government of Sri Lanka</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1B365D; margin-top: 0;">Welcome, ${name}!</h2>
          <p>You have successfully registered for ${process.env.GOV_SERVICE_NAME}. Your account as a <strong>${userType}</strong> has been created.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFC72C;">
            <h3 style="color: #1B365D; margin-top: 0;">Next Steps:</h3>
            <ul style="color: #555; line-height: 1.6;">
              ${userType === 'citizen' 
                ? `
                  <li>Verify your email address to activate your account</li>
                  <li>Complete your profile with NIC and other details</li>
                  <li>Upload required documents for verification</li>
                  <li>Access government services and book appointments</li>
                ` 
                : userType === 'agent'
                ? `
                  <li>Complete your agent verification process</li>
                  <li>Set up your service specializations</li>
                  <li>Configure your availability schedule</li>
                  <li>Start assisting citizens with government services</li>
                `
                : `
                  <li>Complete admin verification</li>
                  <li>Set up system configurations</li>
                  <li>Manage user accounts and verifications</li>
                  <li>Monitor system reports and analytics</li>
                `
              }
            </ul>
          </div>

          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #1565c0; font-size: 14px;">
              <strong>Security Notice:</strong> Keep your login credentials secure. GovLink will never ask for your password via email.
            </p>
          </div>

          <p style="color: #666; margin-top: 30px;">
            For support, contact us at <a href="mailto:${process.env.GOV_CONTACT_EMAIL}" style="color: #1B365D;">${process.env.GOV_CONTACT_EMAIL}</a>
          </p>
          
          <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
            ${process.env.GOV_DEPARTMENT_NAME}<br>
            <a href="${process.env.GOV_WEBSITE}" style="color: #1B365D;">${process.env.GOV_WEBSITE}</a>
          </p>
        </div>
      </div>
    `,
  }),

  // Email verification for account activation
  emailVerification: (name: string, verificationLink: string) => ({
    subject: `Verify Your ${process.env.GOV_SERVICE_NAME} Account - Required for Access`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #FFC72C; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #1B365D 0%, #2E5F8A 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📧 Email Verification Required</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${process.env.GOV_SERVICE_NAME}</p>
        </div>
        <div style="padding: 30px;">
          <p>Dear <strong>${name}</strong>,</p>
          <p>To activate your ${process.env.GOV_SERVICE_NAME} account and access government services, please verify your email address.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background: linear-gradient(135deg, #FFC72C 0%, #FFB300 100%); color: #1B365D; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
              ✓ Verify Email Address
            </a>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Important:</strong> This link will expire in 24 hours. If you don't verify your email, you won't be able to access government services.
            </p>
          </div>

          <p style="font-size: 12px; color: #666; margin-top: 20px; word-break: break-all;">
            If the button doesn't work, copy and paste this link:<br>
            <span style="background: #f5f5f5; padding: 5px; border-radius: 3px;">${verificationLink}</span>
          </p>
          
          <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
            ${process.env.GOV_DEPARTMENT_NAME}<br>
            <a href="${process.env.GOV_WEBSITE}" style="color: #1B365D;">${process.env.GOV_WEBSITE}</a>
          </p>
        </div>
      </div>
    `,
  }),

  // Password reset for users
  passwordReset: (name: string, resetLink: string) => ({
    subject: `Reset Your ${process.env.GOV_SERVICE_NAME} Password - Secure Access`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #FFC72C; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🔐 Password Reset Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${process.env.GOV_SERVICE_NAME}</p>
        </div>
        <div style="padding: 30px;">
          <p>Dear <strong>${name}</strong>,</p>
          <p>You requested to reset your password for your ${process.env.GOV_SERVICE_NAME} account. Click the button below to create a new secure password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
              🔑 Reset Password
            </a>
          </div>
          
          <div style="background-color: #fee2e2; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p style="margin: 0; color: #991b1b; font-size: 14px;">
              <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email and contact support immediately.
            </p>
          </div>

          <p style="font-size: 12px; color: #666; margin-top: 20px; word-break: break-all;">
            If the button doesn't work, copy and paste this link:<br>
            <span style="background: #f5f5f5; padding: 5px; border-radius: 3px;">${resetLink}</span>
          </p>
          
          <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
            ${process.env.GOV_DEPARTMENT_NAME}<br>
            <a href="${process.env.GOV_WEBSITE}" style="color: #1B365D;">${process.env.GOV_WEBSITE}</a>
          </p>
        </div>
      </div>
    `,
  }),

  // Account verification status update
  accountVerification: (name: string, status: 'approved' | 'rejected' | 'pending', reason?: string) => ({
    subject: `Account Verification ${status === 'approved' ? 'Approved' : status === 'rejected' ? 'Update Required' : 'In Progress'} - ${process.env.GOV_SERVICE_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #FFC72C; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, ${status === 'approved' ? '#059669' : status === 'rejected' ? '#dc2626' : '#f59e0b'} 0%, ${status === 'approved' ? '#047857' : status === 'rejected' ? '#b91c1c' : '#d97706'} 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">
            ${status === 'approved' ? '✅ Account Verified' : status === 'rejected' ? '⚠️ Verification Update' : '⏳ Verification in Progress'}
          </h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${process.env.GOV_SERVICE_NAME}</p>
        </div>
        <div style="padding: 30px;">
          <p>Dear <strong>${name}</strong>,</p>
          
          ${status === 'approved' 
            ? `
              <p>Congratulations! Your account has been successfully verified. You now have full access to all ${process.env.GOV_SERVICE_NAME} services.</p>
              <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
                <h3 style="color: #065f46; margin-top: 0;">You can now:</h3>
                <ul style="color: #065f46; line-height: 1.6;">
                  <li>Book appointments with government agents</li>
                  <li>Submit applications and documents</li>
                  <li>Access all digital government services</li>
                  <li>Receive official notifications and updates</li>
                </ul>
              </div>
            `
            : status === 'rejected'
            ? `
              <p>Your account verification requires additional information. Please review the following and update your profile:</p>
              <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3 style="color: #991b1b; margin-top: 0;">Required Action:</h3>
                <p style="color: #991b1b; margin: 0;">${reason || 'Please ensure all required documents are clear and valid. Contact support if you need assistance.'}</p>
              </div>
            `
            : `
              <p>Your account verification is currently being processed by our team. We'll notify you once the review is complete.</p>
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="color: #92400e; margin-top: 0;">Processing Status:</h3>
                <p style="color: #92400e; margin: 0;">Expected completion time: 2-3 business days</p>
              </div>
            `
          }
          
          <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
            ${process.env.GOV_DEPARTMENT_NAME}<br>
            <a href="${process.env.GOV_WEBSITE}" style="color: #1B365D;">${process.env.GOV_WEBSITE}</a>
          </p>
        </div>
      </div>
    `,
  }),

  // Appointment confirmation
  appointmentConfirmation: (name: string, appointmentDetails: { service: string; date: string; time: string; agent: string; location?: string }) => ({
    subject: `Appointment Confirmed - ${appointmentDetails.service} | ${process.env.GOV_SERVICE_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #FFC72C; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📅 Appointment Confirmed</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${process.env.GOV_SERVICE_NAME}</p>
        </div>
        <div style="padding: 30px;">
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your appointment has been successfully scheduled. Please save these details for your records:</p>
          
          <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="color: #065f46; margin-top: 0;">Appointment Details:</h3>
            <table style="width: 100%; color: #065f46;">
              <tr><td style="padding: 5px 0; font-weight: bold;">Service:</td><td style="padding: 5px 0;">${appointmentDetails.service}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Date:</td><td style="padding: 5px 0;">${appointmentDetails.date}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Time:</td><td style="padding: 5px 0;">${appointmentDetails.time}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Agent:</td><td style="padding: 5px 0;">${appointmentDetails.agent}</td></tr>
              ${appointmentDetails.location ? `<tr><td style="padding: 5px 0; font-weight: bold;">Location:</td><td style="padding: 5px 0;">${appointmentDetails.location}</td></tr>` : ''}
            </table>
          </div>

          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #1565c0; font-size: 14px;">
              <strong>Important:</strong> Please arrive 15 minutes early and bring all required documents. You can reschedule up to 24 hours before the appointment.
            </p>
          </div>
          
          <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
            ${process.env.GOV_DEPARTMENT_NAME}<br>
            <a href="${process.env.GOV_WEBSITE}" style="color: #1B365D;">${process.env.GOV_WEBSITE}</a>
          </p>
        </div>
      </div>
    `,
  }),
};

// Specialized functions for common GovLink email scenarios
export const sendWelcomeEmail = async (name: string, email: string, userType: 'citizen' | 'agent' | 'admin') => {
  const template = govLinkEmailTemplates.welcome(name, userType);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

export const sendEmailVerification = async (name: string, email: string, verificationToken: string) => {
  const verificationLink = `${process.env.VERIFICATION_URL_BASE}?token=${verificationToken}`;
  const template = govLinkEmailTemplates.emailVerification(name, verificationLink);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

export const sendPasswordResetEmail = async (name: string, email: string, resetToken: string) => {
  const resetLink = `${process.env.RESET_PASSWORD_URL_BASE}?token=${resetToken}`;
  const template = govLinkEmailTemplates.passwordReset(name, resetLink);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

export const sendAccountVerificationUpdate = async (name: string, email: string, status: 'approved' | 'rejected' | 'pending', reason?: string) => {
  const template = govLinkEmailTemplates.accountVerification(name, status, reason);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

export const sendAppointmentConfirmation = async (name: string, email: string, appointmentDetails: { service: string; date: string; time: string; agent: string; location?: string }) => {
  const template = govLinkEmailTemplates.appointmentConfirmation(name, appointmentDetails);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

// Bulk email function for government announcements
export const sendBulkEmail = async (
  recipients: string[],
  template: { subject: string; html: string },
  batchSize: number = 50
): Promise<{ success: boolean; sent: number; failed: number; errors: { email: string; error: unknown }[] }> => {
  let sent = 0;
  let failed = 0;
  const errors: { email: string; error: unknown }[] = [];

  // Process in batches to avoid rate limits
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const promises = batch.map(async (email) => {
      try {
        await sendEmail({
          to: email,
          subject: template.subject,
          html: template.html,
        });
        sent++;
      } catch (error) {
        failed++;
        errors.push({ email, error });
      }
    });

    await Promise.allSettled(promises);
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return {
    success: failed === 0,
    sent,
    failed,
    errors,
  };
};
