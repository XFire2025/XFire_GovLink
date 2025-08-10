import { IUser } from '../models/userSchema';
import User from '../models/userSchema';
import { hashPassword, verifyPassword, validatePassword } from './user-password';
import { 
  generateTokenPair, 
  generateEmailVerificationToken, 
  generatePasswordResetToken,
  verifyRefreshToken,
  verifyEmailVerificationToken,
  verifyPasswordResetToken
} from './user-jwt';
import { sendWelcomeEmail, sendEmailVerification, sendPasswordResetEmail } from '../services/govlinkEmailService';
import connectDB from '../db';

// Registration data interface
export interface UserRegistrationData {
  fullName: string;
  nicNumber: string;
  dateOfBirth: string;
  mobileNumber: string;
  email: string;
  password: string;
  preferredLanguage?: 'en' | 'si' | 'ta';
}

// Login data interface
export interface UserLoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Authentication response interface
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: Partial<IUser>;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  errors?: string[];
}

// Password reset data interface
export interface PasswordResetData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// User service class
export class UserAuthService {
  
  // Register new user
  static async registerUser(userData: UserRegistrationData): Promise<AuthResponse> {
    try {
      await connectDB();

      // Validate input data
      const validation = this.validateRegistrationData(userData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        };
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: userData.email.toLowerCase() },
          { nicNumber: userData.nicNumber.replace(/\s+/g, '') }
        ]
      });

      if (existingUser) {
        const field = existingUser.email === userData.email.toLowerCase() ? 'email' : 'NIC number';
        return {
          success: false,
          message: `User with this ${field} already exists`,
          errors: [`${field} is already registered`]
        };
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create new user
      const newUser = new User({
        fullName: userData.fullName.trim(),
        nicNumber: userData.nicNumber.replace(/\s+/g, '').toUpperCase(),
        dateOfBirth: new Date(userData.dateOfBirth),
        mobileNumber: userData.mobileNumber.replace(/\s+/g, ''),
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        preferredLanguage: userData.preferredLanguage || 'en',
        role: 'citizen',
        accountStatus: 'pending_verification',
        profileStatus: 'incomplete',
        verificationStatus: 'unverified',
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,
        loginAttempts: 0,
        notifications: {
          email: true,
          sms: true,
          push: true
        },
        documents: [],
        servicesUsed: [],
        appointmentHistory: [],
        submissionHistory: []
      });

      const savedUser = await newUser.save();

      // Generate email verification token
      const emailToken = generateEmailVerificationToken(savedUser);

      // Send verification email
      try {
        await sendEmailVerification(savedUser.fullName, savedUser.email, emailToken);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails
      }

      // Send welcome email
      try {
        await sendWelcomeEmail(savedUser.fullName, savedUser.email, savedUser.role);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail registration if email fails
      }

      // Generate tokens
      const tokens = generateTokenPair(savedUser);

      // Return success response (without sensitive data)
      return {
        success: true,
        message: 'Registration successful. Please check your email for verification.',
        user: {
          _id: savedUser._id,
          fullName: savedUser.fullName,
          email: savedUser.email,
          role: savedUser.role,
          accountStatus: savedUser.accountStatus,
          profileStatus: savedUser.profileStatus,
          verificationStatus: savedUser.verificationStatus,
          emailVerified: savedUser.emailVerified,
          phoneVerified: savedUser.phoneVerified,
          preferredLanguage: savedUser.preferredLanguage
        },
        tokens
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed due to server error',
        errors: ['Internal server error occurred']
      };
    }
  }

  // Login user
  static async loginUser(loginData: UserLoginData): Promise<AuthResponse> {
    try {
      await connectDB();

      const { email, password } = loginData;

      // Find user by email
      const user = await User.findOne({ 
        email: email.toLowerCase().trim() 
      }).select('+password');

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
          errors: ['User not found']
        };
      }

      // Check if account is locked
      if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
        const lockTime = Math.ceil((user.accountLockedUntil.getTime() - Date.now()) / (1000 * 60));
        return {
          success: false,
          message: `Account is locked. Try again in ${lockTime} minutes.`,
          errors: ['Account temporarily locked']
        };
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        // Increment login attempts
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        
        // Lock account after 5 failed attempts
        if (user.loginAttempts >= 5) {
          user.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        }
        
        await user.save();

        return {
          success: false,
          message: 'Invalid email or password',
          errors: ['Incorrect password']
        };
      }

      // Check account status
      if (user.accountStatus === 'suspended') {
        return {
          success: false,
          message: 'Your account has been suspended. Please contact support.',
          errors: ['Account suspended']
        };
      }

      if (user.accountStatus === 'deactivated') {
        return {
          success: false,
          message: 'Your account has been deactivated. Please contact support.',
          errors: ['Account deactivated']
        };
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0;
      user.accountLockedUntil = undefined;
      user.lastLoginAt = new Date();
      await user.save();

      // Generate tokens
      const tokens = generateTokenPair(user);

      return {
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
          profileStatus: user.profileStatus,
          verificationStatus: user.verificationStatus,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          preferredLanguage: user.preferredLanguage,
          lastLoginAt: user.lastLoginAt
        },
        tokens
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed due to server error',
        errors: ['Internal server error occurred']
      };
    }
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      await connectDB();

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          errors: ['Invalid user']
        };
      }

      // Check account status
      if (user.accountStatus === 'suspended' || user.accountStatus === 'deactivated') {
        return {
          success: false,
          message: 'Account is not active',
          errors: ['Account not active']
        };
      }

      // Generate new tokens
      const tokens = generateTokenPair(user);

      return {
        success: true,
        message: 'Token refreshed successfully',
        tokens
      };

    } catch (error) {
      return {
        success: false,
        message: 'Token refresh failed',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Verify email
  static async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      await connectDB();

      // Verify email token
      const decoded = verifyEmailVerificationToken(token);

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          errors: ['Invalid user']
        };
      }

      // Check if already verified
      if (user.emailVerified) {
        return {
          success: true,
          message: 'Email is already verified'
        };
      }

      // Update user
      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
      
      // Update verification status
      if (user.verificationStatus === 'unverified') {
        user.verificationStatus = 'email_verified';
      }

      await user.save();

      return {
        success: true,
        message: 'Email verified successfully'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Email verification failed',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      await connectDB();

      // Find user
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        // Don't reveal if email exists for security
        return {
          success: true,
          message: 'If the email exists, a password reset link has been sent.'
        };
      }

      // Generate reset token
      const resetToken = generatePasswordResetToken(user);

      // Save reset token to user
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      // Send reset email
      try {
        await sendPasswordResetEmail(user.fullName, user.email, resetToken);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        return {
          success: false,
          message: 'Failed to send password reset email',
          errors: ['Email service error']
        };
      }

      return {
        success: true,
        message: 'Password reset link has been sent to your email.'
      };

    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Password reset request failed',
        errors: ['Internal server error occurred']
      };
    }
  }

  // Reset password
  static async resetPassword(resetData: PasswordResetData): Promise<AuthResponse> {
    try {
      await connectDB();

      const { token, newPassword, confirmPassword } = resetData;

      // Validate passwords match
      if (newPassword !== confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match',
          errors: ['Password confirmation failed']
        };
      }

      // Verify reset token
      const decoded = verifyPasswordResetToken(token);

      // Find user
      const user = await User.findById(decoded.userId).select('+password');
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          errors: ['Invalid user']
        };
      }

      // Check if token matches and hasn't expired
      if (user.passwordResetToken !== token || 
          !user.passwordResetExpires || 
          user.passwordResetExpires < new Date()) {
        return {
          success: false,
          message: 'Password reset token is invalid or expired',
          errors: ['Invalid or expired token']
        };
      }

      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: 'Password does not meet requirements',
          errors: passwordValidation.errors
        };
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.loginAttempts = 0;
      user.accountLockedUntil = undefined;
      
      await user.save();

      return {
        success: true,
        message: 'Password has been reset successfully'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Password reset failed',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get user profile
  static async getUserProfile(userId: string): Promise<AuthResponse> {
    try {
      await connectDB();

      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          errors: ['Invalid user ID']
        };
      }

      return {
        success: true,
        message: 'Profile retrieved successfully',
        user: {
          _id: user._id,
          fullName: user.fullName,
          nameInSinhala: user.nameInSinhala,
          nameInTamil: user.nameInTamil,
          email: user.email,
          nicNumber: user.nicNumber,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          nationality: user.nationality,
          mobileNumber: user.mobileNumber,
          alternativePhoneNumber: user.alternativePhoneNumber,
          role: user.role,
          accountStatus: user.accountStatus,
          profileStatus: user.profileStatus,
          verificationStatus: user.verificationStatus,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          preferredLanguage: user.preferredLanguage,
          profilePicture: user.profilePicture,
          permanentAddress: user.permanentAddress,
          currentAddress: user.currentAddress,
          isSameAddress: user.isSameAddress,
          emergencyContact: user.emergencyContact,
          notifications: user.notifications,
          twoFactorEnabled: user.twoFactorEnabled,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      };

    } catch (err) {
      console.error('Profile retrieval error:', err);
      return {
        success: false,
        message: 'Failed to retrieve profile',
        errors: ['Internal server error occurred']
      };
    }
  }

  // Validate registration data
  private static validateRegistrationData(userData: UserRegistrationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate full name
    if (!userData.fullName || userData.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }

    // Validate NIC number
    const nicPattern = /^(\d{9}[VvXx]|\d{12})$/;
    if (!userData.nicNumber || !nicPattern.test(userData.nicNumber.replace(/\s+/g, ''))) {
      errors.push('Please enter a valid Sri Lankan NIC number');
    }

    // Validate date of birth
    if (!userData.dateOfBirth) {
      errors.push('Date of birth is required');
    } else {
      const birthDate = new Date(userData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 16) {
        errors.push('You must be at least 16 years old to register');
      }
    }

    // Validate mobile number
    const mobilePattern = /^(\+94|0)([7][01245678]\d{7})$/;
    if (!userData.mobileNumber || !mobilePattern.test(userData.mobileNumber.replace(/\s+/g, ''))) {
      errors.push('Please enter a valid Sri Lankan mobile number');
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailPattern.test(userData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate password
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    return { isValid: errors.length === 0, errors };
  }
}

export default UserAuthService;
