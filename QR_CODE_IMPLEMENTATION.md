# QR Code Implementation for GovLink Appointments

## Overview
This implementation adds comprehensive QR code functionality to the GovLink appointment system, allowing users to receive QR code passes via email and display them in the interface.

## Features Implemented

### 1. QR Code Generation Service (`src/lib/services/qrCodeService.ts`)
- **QR Code Data Generation**: Creates structured JSON data containing appointment details
- **Image Generation**: Uses `qrcode` library to generate PNG images
- **R2 Storage**: Uploads QR codes to cloud storage for persistence
- **Email Integration**: Sends beautiful HTML emails with QR codes as attachments
- **Verification URL**: Generates public verification URLs for QR codes

### 2. Enhanced Appointment Schema (`src/lib/models/appointmentSchema.ts`)
- **QR Code Field**: Added `qrCode` object with data, imageUrl, and generatedAt
- **Booking Reference**: Unique reference numbers for each appointment
- **Email Templates**: Comprehensive appointment pass emails

### 3. Appointment API Updates (`src/app/api/user/appointments/route.ts`)
- **Automatic QR Generation**: QR codes generated when appointments are created
- **Email Notifications**: Sends appointment pass emails with QR codes
- **Error Handling**: Graceful fallback if QR generation fails

### 4. Email Service Integration (`src/lib/services/govlinkEmailService.ts`)
- **Appointment Pass Template**: Beautiful HTML email template with QR codes
- **Multilingual Support**: Email templates support multiple languages
- **Professional Styling**: Sri Lankan government branding
- **Attachment Support**: QR codes attached as PNG files

### 5. User Interface Components

#### QR Code Display Component (`src/components/user/QRCodeDisplay.tsx`)
- **Modal Interface**: Full-screen modal for viewing QR codes
- **Download Functionality**: Users can download QR codes as PNG files
- **Print Support**: Print-friendly QR code passes
- **Responsive Design**: Works on mobile and desktop
- **Appointment Details**: Shows complete appointment information

#### Booking Page Updates (`src/app/user/booking/page.tsx`)
- **View Pass Button**: Button to view QR code for upcoming appointments
- **Booking References**: Shows booking reference numbers instead of IDs
- **QR Code Modal**: Integrated QR code display functionality
- **Multilingual UI**: Translated interface for QR code features

### 6. Public Verification API (`src/app/api/public/verify-appointment/route.ts`)
- **QR Code Verification**: Agents can verify QR codes and booking references
- **Status Validation**: Checks appointment status and date validity
- **Check-in Functionality**: Mark appointments as checked in
- **Complete Functionality**: Mark appointments as completed

## Technical Stack
- **QR Code Generation**: `qrcode` library
- **Email Service**: `nodemailer` with HTML templates
- **File Storage**: Cloudflare R2 for QR code images
- **Database**: MongoDB with Mongoose schemas
- **Frontend**: Next.js with React components

## Usage Flow

### For Citizens:
1. **Book Appointment**: Create appointment through booking form
2. **Receive Email**: Get appointment pass email with QR code attachment
3. **View Pass**: Use "View Pass" button in booking interface to see QR code
4. **Download/Print**: Download or print QR code for offline use
5. **Attend Appointment**: Present QR code at government office

### For Agents/Staff:
1. **Scan QR Code**: Use QR code scanner or manual entry
2. **Verify Appointment**: Check appointment validity through public API
3. **Check-in Citizen**: Mark appointment as confirmed
4. **Complete Service**: Mark appointment as completed

## API Endpoints

### Public Endpoints
- `GET /api/public/verify-appointment?ref={bookingReference}` - Verify by reference
- `GET /api/public/verify-appointment?data={qrData}` - Verify by QR data
- `POST /api/public/verify-appointment` - Check-in or complete appointments

### User Endpoints
- `POST /api/user/appointments` - Create appointment (generates QR code)
- `GET /api/user/appointments` - List user appointments with QR codes

## Security Features
- **Unique References**: Each appointment has a unique booking reference
- **Date Validation**: QR codes only valid within appointment date range
- **Status Checks**: Only confirmed/pending appointments can be checked in
- **Public Verification**: Read-only verification without authentication

## Environment Variables Required
```env
# Email Service
MAIL_ID=your-email@gmail.com
MAIL_PW=your-app-password
GOV_SERVICE_NAME=GovLink
GOV_DEPARTMENT_NAME=Government of Sri Lanka
GOV_CONTACT_EMAIL=support@govlink.lk
GOV_WEBSITE=https://govlink.lk

# Base URLs
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
```

## Installation Requirements
```bash
npm install qrcode @types/qrcode nodemailer @types/nodemailer
```

## Future Enhancements
1. **SMS Notifications**: Send QR codes via SMS as backup
2. **Barcode Support**: Add barcode generation alongside QR codes
3. **Analytics**: Track QR code scans and usage
4. **Offline Verification**: Generate offline verification codes
5. **Agent Mobile App**: Mobile app for agents to scan QR codes
6. **Real-time Updates**: WebSocket updates for appointment status changes

## Testing the Implementation
1. Create a new appointment through the booking form
2. Check database for generated QR code data
3. Verify email is sent with QR code attachment
4. Test QR code display in booking interface
5. Verify QR code using public API endpoint
6. Test download and print functionality

This implementation provides a complete QR code solution for the GovLink appointment system, enhancing user experience and streamlining the check-in process at government offices.
