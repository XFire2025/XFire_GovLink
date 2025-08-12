import { IAdmin } from '../models/adminSchema';
import Admin from '../models/adminSchema';
import { verifyPassword } from './user-password';
import { 
  generateTokenPair, 
  verifyRefreshToken
} from './user-jwt';
import { IUser } from '../models/userSchema';
import connectDB from '../db';

// Admin login data interface
export interface AdminLoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Admin authentication response interface
export interface AdminAuthResponse {
  success: boolean;
  message: string;
  admin?: Partial<IAdmin>;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  errors?: string[];
}

// Admin auth service class
export class AdminAuthService {
  
  // Login admin
  static async loginAdmin(loginData: AdminLoginData): Promise<AdminAuthResponse> {
    try {
      await connectDB();

      const { email, password } = loginData;

      // Find admin by email
      const admin = await Admin.findOne({ 
        email: email.toLowerCase().trim() 
      }).select('+password');

      if (!admin) {
        return {
          success: false,
          message: 'Invalid email or password',
          errors: ['Admin not found']
        };
      }

      // Check if account is locked
      if (admin.accountLockedUntil && admin.accountLockedUntil > new Date()) {
        const lockTime = Math.ceil((admin.accountLockedUntil.getTime() - Date.now()) / (1000 * 60));
        return {
          success: false,
          message: `Account is locked. Try again in ${lockTime} minutes.`,
          errors: ['Account temporarily locked']
        };
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, admin.password);

      if (!isPasswordValid) {
        // Increment login attempts and lock account if needed
        const updateData: {
          loginAttempts: number;
          accountLockedUntil?: Date;
        } = {
          loginAttempts: (admin.loginAttempts || 0) + 1
        };
        
        // Lock account after 3 failed attempts (more strict for admin)
        if (updateData.loginAttempts >= 3) {
          updateData.accountLockedUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        }
        
        await Admin.findByIdAndUpdate(admin._id, updateData, { runValidators: false });

        return {
          success: false,
          message: 'Invalid email or password',
          errors: ['Incorrect password']
        };
      }

      // Check account status
      if (admin.accountStatus === 'SUSPENDED') {
        return {
          success: false,
          message: 'Your admin account has been suspended. Please contact system administrator.',
          errors: ['Account suspended']
        };
      }

      if (admin.accountStatus === 'DEACTIVATED') {
        return {
          success: false,
          message: 'Your admin account has been deactivated. Please contact system administrator.',
          errors: ['Account deactivated']
        };
      }

      // Reset login attempts on successful login
      await Admin.findByIdAndUpdate(
        admin._id,
        {
          loginAttempts: 0,
          accountLockedUntil: undefined,
          lastLoginAt: new Date()
        },
        { runValidators: false }
      );

      // Generate tokens (reusing user JWT functions as they work the same way)
      const adminUser = {
        _id: admin._id,
        email: admin.email,
        role: 'admin',
        fullName: admin.fullName
      } as const;
  const tokens = generateTokenPair(adminUser as IUser);

      return {
        success: true,
        message: 'Admin login successful',
        admin: {
          _id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          accountStatus: admin.accountStatus,
          lastLoginAt: admin.lastLoginAt
        },
        tokens
      };

    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        message: 'Login failed due to server error',
        errors: ['Internal server error occurred']
      };
    }
  }

  // Refresh admin access token
  static async refreshAdminToken(refreshToken: string): Promise<AdminAuthResponse> {
    try {
      await connectDB();

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Find admin
      const admin = await Admin.findById(decoded.userId);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found',
          errors: ['Invalid refresh token - admin not found']
        };
      }

      // Check account status
      if (admin.accountStatus !== 'ACTIVE') {
        return {
          success: false,
          message: 'Admin account is not active',
          errors: ['Account not active']
        };
      }

      // Generate new tokens
      const adminUser = {
        _id: admin._id,
        email: admin.email,
        role: 'admin',
        fullName: admin.fullName
      } as const;
  const tokens = generateTokenPair(adminUser as IUser);

      return {
        success: true,
        message: 'Token refreshed successfully',
        admin: {
          _id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          accountStatus: admin.accountStatus,
          lastLoginAt: admin.lastLoginAt
        },
        tokens
      };

    } catch (error) {
      console.error('Admin token refresh error:', error);
      return {
        success: false,
        message: 'Token refresh failed',
        errors: ['Invalid or expired refresh token']
      };
    }
  }

  // Get admin profile
  static async getAdminProfile(adminId: string): Promise<AdminAuthResponse> {
    try {
      await connectDB();

      const admin = await Admin.findById(adminId);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found',
          errors: ['Admin not found']
        };
      }

      return {
        success: true,
        message: 'Admin profile retrieved successfully',
        admin: {
          _id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          accountStatus: admin.accountStatus,
          lastLoginAt: admin.lastLoginAt
        }
      };

    } catch (error) {
      console.error('Get admin profile error:', error);
      return {
        success: false,
        message: 'Failed to retrieve admin profile',
        errors: ['Internal server error occurred']
      };
    }
  }

  // Validate admin login data
  static validateLoginData(loginData: AdminLoginData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!loginData.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.push('Invalid email format');
    }

    if (!loginData.password) {
      errors.push('Password is required');
    } else if (loginData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default AdminAuthService;
