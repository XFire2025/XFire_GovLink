// lib/services/qrCodeService.ts
import QRCode from 'qrcode';
import { uploadFileToR2 } from '@/lib/r2';
import { sendEmail } from './govlinkEmailService';

export interface QRCodeData {
  bookingReference: string;
  citizenName: string;
  serviceType: string;
  department: string;
  date: string;
  time: string;
  agentName: string;
  office: string;
  verificationUrl: string;
}

export interface QRCodeResult {
  success: boolean;
  data?: string;
  imageUrl?: string;
  message?: string;
}

/**
 * Generate QR code data string from appointment information
 */
export function generateQRCodeData(appointmentData: QRCodeData): string {
  const qrData = {
    ref: appointmentData.bookingReference,
    name: appointmentData.citizenName,
    service: appointmentData.serviceType,
    dept: appointmentData.department,
    date: appointmentData.date,
    time: appointmentData.time,
    agent: appointmentData.agentName,
    office: appointmentData.office,
    verify: appointmentData.verificationUrl,
    generated: new Date().toISOString()
  };
  
  return JSON.stringify(qrData);
}

/**
 * Generate QR code image and upload to R2 storage
 */
export async function generateQRCodeImage(
  qrData: string,
  bookingReference: string
): Promise<QRCodeResult> {
  try {
    // Generate QR code as buffer
    const qrCodeBuffer = await QRCode.toBuffer(qrData, {
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `qr-${bookingReference}-${timestamp}.png`;
    const folderPath = `appointments/qr-codes`;

    // Upload to R2
    const uploadResult = await uploadFileToR2(
      qrCodeBuffer,
      fileName,
      'image/png',
      folderPath
    );

    if (!uploadResult.success || !uploadResult.key) {
      return {
        success: false,
        message: 'Failed to upload QR code image'
      };
    }

    // Construct public URL - R2_ENDPOINT already includes the bucket
    const publicUrl = `${process.env.R2_ENDPOINT}/${uploadResult.key}`;
    
    console.log('📸 QR code uploaded to:', publicUrl);

    return {
      success: true,
      data: qrData,
      imageUrl: publicUrl,
      message: 'QR code generated successfully'
    };

  } catch (error) {
    console.error('QR Code generation error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown QR code generation error'
    };
  }
}

/**
 * Generate verification URL for appointment
 */
export function generateVerificationUrl(bookingReference: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/api/public/verify-appointment?ref=${bookingReference}`;
}

/**
 * Parse QR code data
 */
export function parseQRCodeData(qrDataString: string): QRCodeData | null {
  try {
    return JSON.parse(qrDataString);
  } catch (error) {
    console.error('Failed to parse QR code data:', error);
    return null;
  }
}

/**
 * Send QR code email with appointment details and pass
 */
export async function sendQRCodeEmail(
  citizenName: string,
  citizenEmail: string,
  appointmentData: QRCodeData,
  qrCodeImageUrl?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const attachments = [];
    
    // If QR code image URL is provided, download it using our API and attach as buffer
    if (qrCodeImageUrl) {
      try {
        console.log('📎 Downloading QR code image for email attachment:', qrCodeImageUrl);
        
        // Extract the key from the R2 URL for download
        const urlObj = new URL(qrCodeImageUrl);
        const pathParts = urlObj.pathname.split('/').filter(part => part !== '');
        // Remove bucket name (first part) and join the rest to get the key
        const key = pathParts.slice(1).join('/');
        
        // Use the file download API to get the file buffer
        const downloadResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/file/retrieve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: key })
        });
        
        if (downloadResponse.ok) {
          const downloadData = await downloadResponse.json();
          if (downloadData.success && downloadData.data?.base64Data) {
            // Convert base64 back to buffer for email attachment
            const buffer = Buffer.from(downloadData.data.base64Data, 'base64');
            
            attachments.push({
              filename: `appointment-pass-${appointmentData.bookingReference}.png`,
              content: buffer,
              contentType: 'image/png'
            });
            
            console.log('✅ QR code image prepared for email attachment');
          } else {
            console.warn('⚠️ Failed to download QR code for email:', downloadData.message);
          }
        } else {
          console.warn('⚠️ Download API returned error:', downloadResponse.status, downloadResponse.statusText);
        }
      } catch (downloadError) {
        console.warn('⚠️ Error downloading QR code for email:', downloadError);
        // Continue without attachment rather than failing the entire email
      }
    }

    const emailTemplate = generateAppointmentPassEmail(citizenName, appointmentData);

    const result = await sendEmail({
      to: citizenEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    return result;
  } catch (error) {
    console.error('Error sending QR code email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send QR code email'
    };
  }
}

/**
 * Generate appointment pass email template with QR code
 */
function generateAppointmentPassEmail(citizenName: string, appointmentData: QRCodeData) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return {
    subject: `🎫 Your Appointment Pass - ${appointmentData.serviceType} | ${process.env.GOV_SERVICE_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #FFC72C; border-radius: 10px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1B365D 0%, #2E5F8A 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎫 Appointment Pass</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${process.env.GOV_SERVICE_NAME}</p>
          <div style="background: rgba(255, 199, 44, 0.2); padding: 10px; border-radius: 5px; margin-top: 15px;">
            <h2 style="margin: 0; font-size: 24px; color: #FFC72C;">REF: ${appointmentData.bookingReference}</h2>
          </div>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px;">
          <p style="font-size: 18px; margin-top: 0;">Dear <strong>${citizenName}</strong>,</p>
          <p style="color: #555; font-size: 16px;">Your appointment has been confirmed! Please bring this email as your digital pass. You can also download and print the QR code attachment.</p>

          <!-- Appointment Card -->
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #FFC72C; border-radius: 12px; padding: 25px; margin: 25px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #1B365D; margin: 0; font-size: 24px;">📋 ${appointmentData.serviceType.toUpperCase()}</h2>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">${appointmentData.department}</p>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between;">
              <!-- Date & Time -->
              <div style="background: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px; border-left: 4px solid #059669;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <span style="color: #059669; font-size: 18px; margin-right: 8px;">📅</span>
                  <strong style="color: #1B365D;">Date & Time</strong>
                </div>
                <p style="margin: 0; color: #333; font-size: 16px;">${formatDate(appointmentData.date)}</p>
                <p style="margin: 5px 0 0 0; color: #059669; font-size: 18px; font-weight: bold;">${formatTime(appointmentData.time)}</p>
              </div>

              <!-- Agent & Location -->
              <div style="background: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px; border-left: 4px solid #2563eb;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <span style="color: #2563eb; font-size: 18px; margin-right: 8px;">👤</span>
                  <strong style="color: #1B365D;">Agent & Location</strong>
                </div>
                <p style="margin: 0; color: #333; font-size: 16px;">${appointmentData.agentName}</p>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">📍 ${appointmentData.office}</p>
              </div>
            </div>

            <!-- QR Code Section -->
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px; border: 2px dashed #FFC72C;">
              <h3 style="color: #1B365D; margin-top: 0;">📱 Digital Pass</h3>
              <p style="color: #666; margin-bottom: 15px;">Present this QR code at the office for quick check-in</p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 0; font-family: monospace; font-size: 12px; color: #666; word-break: break-all;">
                  QR Code attached to this email
                </p>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1976d2;">
            <h3 style="color: #1565c0; margin-top: 0;">📋 Instructions</h3>
            <ul style="color: #1565c0; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li><strong>Arrive 15 minutes early</strong> for document verification</li>
              <li><strong>Bring original documents</strong> and photocopies as required</li>
              <li><strong>Present this email or QR code</strong> at the reception</li>
              <li><strong>Keep your phone charged</strong> to display the digital pass</li>
              <li><strong>Contact support</strong> if you need to reschedule (24h notice required)</li>
            </ul>
          </div>

          <!-- Emergency Contact -->
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Need Help?</strong> Contact us at <a href="mailto:${process.env.GOV_CONTACT_EMAIL}" style="color: #856404;">${process.env.GOV_CONTACT_EMAIL}</a> or visit <a href="${appointmentData.verificationUrl}" style="color: #856404;">verification portal</a>
            </p>
          </div>

          <!-- Verification Link -->
          <div style="text-align: center; margin: 25px 0;">
            <a href="${appointmentData.verificationUrl}" 
               style="background: linear-gradient(135deg, #FFC72C 0%, #FFB300 100%); color: #1B365D; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              🔍 Verify Appointment Online
            </a>
          </div>
          
          <hr style="border: none; height: 1px; background: #ddd; margin: 30px 0;">
          
          <!-- Footer -->
          <div style="text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              ${process.env.GOV_DEPARTMENT_NAME}<br>
              <a href="${process.env.GOV_WEBSITE}" style="color: #1B365D;">${process.env.GOV_WEBSITE}</a>
            </p>
            <p style="color: #666; font-size: 11px; margin: 10px 0 0 0;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `
  };
}
