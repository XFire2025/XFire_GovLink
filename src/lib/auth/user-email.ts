import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '', // Your email
    pass: process.env.SMTP_PASS || '', // Your email password or app password
  },
  from: process.env.EMAIL_FROM || 'noreply@govlink.lk',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@govlink.lk'
};

// Email template interface
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Email data interface
export interface EmailData {
  to: string | string[];
  subject: string;
  template?: string;
  html?: string;
  text?: string;
  data?: Record<string, unknown>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port,
    secure: EMAIL_CONFIG.secure,
    auth: EMAIL_CONFIG.auth,
    tls: {
      rejectUnauthorized: false // For development only
    }
  });
};

// Email templates
export const EMAIL_TEMPLATES = {
  'email-verification': (data: { name: string; verificationLink: string; language: string }): EmailTemplate => {
    const isEnglish = data.language === 'en';
    const isSinhala = data.language === 'si';
    
    const subject = isEnglish ? 'Verify Your GovLink Account' 
                   : isSinhala ? 'ඔබගේ GovLink ගිණුම තහවුරු කරන්න'
                   : 'உங்கள் GovLink கணக்கை சரிபார்க்கவும்';
    
    const greeting = isEnglish ? `Dear ${data.name},`
                    : isSinhala ? `ගරු ${data.name},`
                    : `அன்புள்ள ${data.name},`;
    
    const mainText = isEnglish 
      ? 'Thank you for registering with GovLink Sri Lanka. Please click the button below to verify your email address:'
      : isSinhala 
      ? 'GovLink ශ්‍රී ලංකා සමග ලියාපදිංචි වීම ගැන ස්තූතියි. ඔබගේ විද්‍යුත් තැපැල් ලිපිනය තහවුරු කිරීමට පහත බොත්තම ක්ලික් කරන්න:'
      : 'GovLink இலங்கையுடன் பதிவு செய்ததற்கு நன்றி. உங்கள் மின்னஞ்சல் முகவரியை சரிபார்க்க கீழே உள்ள பொத்தானைக் கிளிக் செய்யவும்:';
    
    const buttonText = isEnglish ? 'Verify Email'
                      : isSinhala ? 'විද්‍යුත් තැපෑල තහවුරු කරන්න'
                      : 'மின்னஞ்சலை சரிபார்க்கவும்';
    
    const footerText = isEnglish 
      ? 'If you did not create this account, please ignore this email.'
      : isSinhala 
      ? 'ඔබ මෙම ගිණුම නිර්මාණය නොකළේ නම්, කරුණාකර මෙම විද්‍යුත් තැපෑල නොසලකා හරින්න.'
      : 'நீங்கள் இந்த கணக்கை உருவாக்கவில்லை என்றால், இந்த மின்னஞ்சலை புறக்கணிக்கவும்.';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #FFC72C; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #1976D2; }
          .content { margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background-color: #FFC72C; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏛️ GovLink Sri Lanka</div>
          </div>
          <div class="content">
            <p>${greeting}</p>
            <p>${mainText}</p>
            <div style="text-align: center;">
              <a href="${data.verificationLink}" class="button">${buttonText}</a>
            </div>
            <p>${footerText}</p>
          </div>
          <div class="footer">
            <p>© 2025 GovLink Sri Lanka. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `${greeting}\n\n${mainText}\n\nVerification Link: ${data.verificationLink}\n\n${footerText}`;

    return { subject, html, text };
  },

  'password-reset': (data: { name: string; resetLink: string; language: string }): EmailTemplate => {
    const isEnglish = data.language === 'en';
    const isSinhala = data.language === 'si';
    
    const subject = isEnglish ? 'Password Reset Request - GovLink'
                   : isSinhala ? 'මුරපද නැවත සැකසීමේ ඉල්ලීම - GovLink'
                   : 'கடவுச்சொல் மீட்டமை கோரிக்கை - GovLink';
    
    const greeting = isEnglish ? `Dear ${data.name},`
                    : isSinhala ? `ගරු ${data.name},`
                    : `அன்புள்ள ${data.name},`;
    
    const mainText = isEnglish 
      ? 'You have requested to reset your password. Please click the button below to reset your password:'
      : isSinhala 
      ? 'ඔබ ඔබගේ මුරපදය නැවත සැකසීමට ඉල්ලා ඇත. ඔබගේ මුරපදය නැවත සැකසීමට පහත බොත්තම ක්ලික් කරන්න:'
      : 'நீங்கள் உங்கள் கடவுச்சொல்லை மீட்டமைக்க கோரியுள்ளீர்கள். உங்கள் கடவுச்சொல்லை மீட்டமைக்க கீழே உள்ள பொத்தானைக் கிளிக் செய்யவும்:';
    
    const buttonText = isEnglish ? 'Reset Password'
                      : isSinhala ? 'මුරපදය නැවත සකසන්න'
                      : 'கடவுச்சொல்லை மீட்டமை';
    
    const expiryText = isEnglish 
      ? 'This link will expire in 1 hour for security reasons.'
      : isSinhala 
      ? 'ආරක්ෂක හේතූන් මත මෙම සබැඳිය පැය 1 කින් කල් ඉකුත් වේ.'
      : 'பாதுகாப்பு காரணங்களுக்காக இந்த இணைப்பு 1 மணி நேரத்தில் காலாவधி முடிவடையும்.';
    
    const footerText = isEnglish 
      ? 'If you did not request this password reset, please ignore this email and your password will remain unchanged.'
      : isSinhala 
      ? 'ඔබ මෙම මුරපද නැවත සැකසීම ඉල්ලා නොමැති නම්, කරුණාකර මෙම විද්‍යුත් තැපෑල නොසලකා හරින්න සහ ඔබගේ මුරපදය වෙනස් නොවේ.'
      : 'நீங்கள் இந்த கடவுச்சொல் மீட்டமைப்பைக் கோரவில்லை என்றால், இந்த மின்னஞ்சலை புறக்கணித்து உங்கள் கடவுச்சொல் மாறாமல் இருக்கும்.';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #FFC72C; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #1976D2; }
          .content { margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background-color: #FF5722; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏛️ GovLink Sri Lanka</div>
          </div>
          <div class="content">
            <p>${greeting}</p>
            <p>${mainText}</p>
            <div style="text-align: center;">
              <a href="${data.resetLink}" class="button">${buttonText}</a>
            </div>
            <div class="warning">
              <strong>⏰ ${expiryText}</strong>
            </div>
            <p>${footerText}</p>
          </div>
          <div class="footer">
            <p>© 2025 GovLink Sri Lanka. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `${greeting}\n\n${mainText}\n\nReset Link: ${data.resetLink}\n\n${expiryText}\n\n${footerText}`;

    return { subject, html, text };
  }
};

// Send email function
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    let emailContent: { subject: string; html: string; text: string };

    if (emailData.template && emailData.data) {
      // Use template
      const templateFunction = EMAIL_TEMPLATES[emailData.template as keyof typeof EMAIL_TEMPLATES];
      if (!templateFunction) {
        throw new Error(`Template ${emailData.template} not found`);
      }
      emailContent = templateFunction(emailData.data as never);
    } else if (emailData.html || emailData.text) {
      // Use provided content
      emailContent = {
        subject: emailData.subject,
        html: emailData.html || '',
        text: emailData.text || ''
      };
    } else {
      throw new Error('Either template with data or html/text content must be provided');
    }

    const mailOptions = {
      from: EMAIL_CONFIG.from,
      to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      replyTo: EMAIL_CONFIG.replyTo,
      attachments: emailData.attachments
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;

  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return false;
  }
};

// Send bulk emails
export const sendBulkEmail = async (
  recipients: string[], 
  emailData: Omit<EmailData, 'to'>
): Promise<{ success: number; failed: number; errors: string[] }> => {
  const results = { success: 0, failed: 0, errors: [] as string[] };

  for (const recipient of recipients) {
    try {
      const sent = await sendEmail({ ...emailData, to: recipient });
      if (sent) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(`Failed to send to ${recipient}`);
      }
    } catch (error) {
      results.failed++;
      results.errors.push(`Error sending to ${recipient}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return results;
};

// Send email verification email
export const sendEmailVerification = async (
  email: string, 
  name: string, 
  token: string, 
  language: string = 'en'
): Promise<boolean> => {
  const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  return await sendEmail({
    to: email,
    subject: 'Email Verification - GovLink Sri Lanka',
    template: 'email-verification',
    data: {
      name,
      verificationLink,
      language
    }
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string, 
  name: string, 
  token: string, 
  language: string = 'en'
): Promise<boolean> => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  return await sendEmail({
    to: email,
    subject: 'Password Reset - GovLink Sri Lanka',
    template: 'password-reset',
    data: {
      name,
      resetLink,
      language
    }
  });
};
