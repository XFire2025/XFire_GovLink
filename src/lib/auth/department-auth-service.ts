import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload
import connectDB from '@/lib/db';
import Department from '@/lib/models/departmentSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

export interface DepartmentLoginData {
  email: string;
  password: string;
}

export interface DepartmentTokens {
  accessToken: string;
  refreshToken: string;
}

export interface DepartmentAuthResult {
  success: boolean;
  message: string;
  department?: {
    id: string;
    departmentId: string;
    name: string;
    email: string;
    status: string;
    type: string;
  };
  tokens?: DepartmentTokens;
  errors?: string[];
}

// Define a specific type for the JWT payload
interface DepartmentJwtPayload extends JwtPayload {
  departmentId: string;
  departmentCode: string;
  email: string;
  role: 'department';
}

class DepartmentAuthService {
  
  /**
   * Login department user
   */
  static async loginDepartment(loginData: DepartmentLoginData): Promise<DepartmentAuthResult> {
    try {
      await connectDB();
      
      const { email, password } = loginData;
      
      // Basic validation
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required',
          errors: ['Missing email or password']
        };
      }

      // Find department by email
      const department = await Department.findOne({ 
        email: email.toLowerCase() 
      }).select('+password');
      
      if (!department) {
        return {
          success: false,
          message: 'Invalid email or password',
          errors: ['Department not found']
        };
      }

      // Check account status
      if (department.status !== 'ACTIVE') {
        return {
          success: false,
          message: 'Department account is not active',
          errors: ['Account is inactive or suspended']
        };
      }

      // Check if account is locked
      if (department.accountLockedUntil && department.accountLockedUntil > new Date()) {
        const lockTime = Math.ceil((department.accountLockedUntil.getTime() - Date.now()) / (1000 * 60));
        return {
          success: false,
          message: `Account is temporarily locked. Try again in ${lockTime} minutes`,
          errors: ['Account temporarily locked']
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, department.password);
      
      if (!isPasswordValid) {
        // Increment login attempts
        department.loginAttempts += 1;
        
        // Lock account after 5 failed attempts for 30 minutes
        if (department.loginAttempts >= 5) {
          department.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        }
        
        await department.save();
        
        return {
          success: false,
          message: 'Invalid email or password',
          errors: ['Invalid credentials']
        };
      }

      // Generate tokens
      const accessToken = jwt.sign(
        {
          departmentId: department._id,
          departmentCode: department.departmentId,
          email: department.email,
          role: 'department'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const refreshToken = jwt.sign(
        {
          departmentId: department._id,
          email: department.email,
          role: 'department'
        },
        REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      // Update login info
      department.lastLoginAt = new Date();
      department.loginAttempts = 0;
      department.accountLockedUntil = undefined;
      await department.save();

      return {
        success: true,
        message: 'Login successful',
        department: {
          id: department._id.toString(),
          departmentId: department.departmentId,
          name: department.name,
          email: department.email,
          status: department.status,
          type: department.type
        },
        tokens: {
          accessToken,
          refreshToken
        }
      };

    } catch (error) {
      console.error('Department login error:', error);
      return {
        success: false,
        message: 'Internal server error',
        errors: ['Login failed due to server error']
      };
    }
  }

  /**
   * Refresh department access token
   */
  static async refreshDepartmentToken(refreshToken: string): Promise<DepartmentAuthResult> {
    try {
      if (!refreshToken) {
        return {
          success: false,
          message: 'Refresh token is required',
          errors: ['Missing refresh token']
        };
      }

      // Replace 'as any' with the specific JWT payload type
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as DepartmentJwtPayload;

      await connectDB();

      const department = await Department.findById(decoded.departmentId);

      if (!department || department.status !== 'ACTIVE') {
        return {
          success: false,
          message: 'Department not found or inactive',
          errors: ['Invalid department']
        };
      }

      const accessToken = jwt.sign(
        {
          departmentId: department._id,
          departmentCode: department.departmentId,
          email: department.email,
          role: 'department'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        message: 'Token refreshed successfully',
        department: {
          id: department._id.toString(),
          departmentId: department.departmentId,
          name: department.name,
          email: department.email,
          status: department.status,
          type: department.type
        },
        tokens: {
          accessToken,
          refreshToken
        }
      };

    } catch (error) {
      console.error('Department token refresh error:', error);
      return {
        success: false,
        message: 'Invalid or expired refresh token',
        errors: ['Token refresh failed']
      };
    }
  }

  /**
   * Get department profile
   */
  static async getDepartmentProfile(departmentId: string): Promise<DepartmentAuthResult> {
    try {
      await connectDB();
      
      const department = await Department.findById(departmentId);
      
      if (!department) {
        return {
          success: false,
          message: 'Department not found',
          errors: ['Department does not exist']
        };
      }

      return {
        success: true,
        message: 'Profile retrieved successfully',
        department: {
          id: department._id.toString(),
          departmentId: department.departmentId,
          name: department.name,
          email: department.email,
          status: department.status,
          type: department.type
        }
      };

    } catch (error) {
      console.error('Get department profile error:', error);
      return {
        success: false,
        message: 'Failed to retrieve profile',
        errors: ['Profile retrieval failed']
      };
    }
  }

  /**
   * Verify department token
   */
  static verifyDepartmentToken(token: string): { valid: boolean; decoded?: string | DepartmentJwtPayload; error?: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DepartmentJwtPayload;
      return { valid: true, decoded };
    } catch (_error) {
      console.error('Token verification error:', _error); // Log the error
      return { valid: false, error: 'Invalid or expired token' };
    }
  }
}

export default DepartmentAuthService;