import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Agent, { IAgent } from '@/lib/models/agentSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

export interface AgentLoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ProfileUpdateData {
  fullName?: string;
  phoneNumber?: string;
}

export interface AgentTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AgentAuthResult {
  success: boolean;
  message: string;
  agent?: {
    id: string;
    officerId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    position: string;
    department: string;
    officeName: string;
    isActive: boolean;
    assignedDistricts: string[];
  };
  tokens?: AgentTokens;
  errors?: string[];
}

class AgentAuthService {
  
  /**
   * Login agent user
   */
  static async loginAgent(loginData: AgentLoginData): Promise<AgentAuthResult> {
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

      // Find agent by email
      const agent = await Agent.findOne({ 
        email: email.toLowerCase().trim() 
      }).select('+password');

      if (!agent) {
        return {
          success: false,
          message: 'Invalid email or password',
          errors: ['Agent not found']
        };
      }

      // Check if account is active
      if (!agent.isActive) {
        return {
          success: false,
          message: 'Account is not active',
          errors: ['Agent account is deactivated']
        };
      }

      // Check if email is verified (optional - can be enforced later)
      if (!agent.isEmailVerified) {
        return {
          success: false,
          message: 'Email verification required. Please check your email and verify your account.',
          errors: ['Email not verified']
        };
      }

      // Check account lock
      if (agent.accountLockedUntil && agent.accountLockedUntil > new Date()) {
        const lockTime = Math.ceil((agent.accountLockedUntil.getTime() - Date.now()) / (1000 * 60));
        return {
          success: false,
          message: `Account is temporarily locked. Try again in ${lockTime} minutes.`,
          errors: [`Account locked for ${lockTime} minutes`]
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, agent.password);
      
      if (!isPasswordValid) {
        // Increment login attempts
        agent.loginAttempts += 1;
        
        // Lock account after 5 failed attempts for 30 minutes
        if (agent.loginAttempts >= 5) {
          agent.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
          await agent.save();
          
          return {
            success: false,
            message: 'Account locked due to multiple failed login attempts. Try again in 30 minutes.',
            errors: ['Account locked due to failed attempts']
          };
        }
        
        await agent.save();
        
        return {
          success: false,
          message: 'Invalid email or password',
          errors: [`Invalid credentials. ${5 - agent.loginAttempts} attempts remaining.`]
        };
      }

      // Generate tokens
      const tokens = this.generateTokens(agent);

      // Reset login attempts and update last login
      agent.loginAttempts = 0;
      agent.accountLockedUntil = undefined;
      agent.lastLoginAt = new Date();
      await agent.save();

      return {
        success: true,
        message: 'Login successful',
        agent: {
          id: agent._id.toString(),
          officerId: agent.officerId,
          fullName: agent.fullName,
          email: agent.email,
          phoneNumber: agent.phoneNumber,
          position: agent.position,
          department: agent.department || '',
          officeName: agent.officeName,
          isActive: agent.isActive,
          assignedDistricts: agent.assignedDistricts || []
        },
        tokens
      };

    } catch (error) {
      console.error('Agent login error:', error);
      return {
        success: false,
        message: 'Internal server error',
        errors: ['Login failed due to server error']
      };
    }
  }

  /**
   * Generate access and refresh tokens for agent
   */
  private static generateTokens(agent: IAgent): AgentTokens {
    const payload = {
      agentId: String(agent._id),
      officerId: agent.officerId,
      email: agent.email,
      role: 'agent',
      department: agent.department
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): jwt.JwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): jwt.JwtPayload | null {
    try {
      return jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
    } catch {
      return null;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AgentAuthResult> {
    try {
      await connectDB();

      const decoded = this.verifyRefreshToken(refreshToken);
      if (!decoded || !decoded.agentId) {
        return {
          success: false,
          message: 'Invalid refresh token',
          errors: ['Refresh token is invalid or expired']
        };
      }

      // Find agent
      const agent = await Agent.findById(decoded.agentId);
      if (!agent || !agent.isActive) {
        return {
          success: false,
          message: 'Agent not found or inactive',
          errors: ['Agent account not found or deactivated']
        };
      }

      // Generate new tokens
      const tokens = this.generateTokens(agent);

      // Update last login
      await Agent.updateOne(
        { _id: agent._id },
        { lastLoginAt: new Date() }
      );

      return {
        success: true,
        message: 'Token refreshed successfully',
        agent: {
          id: agent._id.toString(),
          officerId: agent.officerId,
          fullName: agent.fullName,
          email: agent.email,
          phoneNumber: agent.phoneNumber,
          position: agent.position,
          department: agent.department || '',
          officeName: agent.officeName,
          isActive: agent.isActive,
          assignedDistricts: agent.assignedDistricts || []
        },
        tokens
      };

    } catch (error) {
      console.error('Agent token refresh error:', error);
      return {
        success: false,
        message: 'Internal server error',
        errors: ['Token refresh failed due to server error']
      };
    }
  }

  /**
   * Get agent profile by ID
   */
  static async getAgentProfile(agentId: string): Promise<AgentAuthResult> {
    try {
      await connectDB();

      const agent = await Agent.findById(agentId);
      if (!agent) {
        return {
          success: false,
          message: 'Agent not found',
          errors: ['Agent not found']
        };
      }

      return {
        success: true,
        message: 'Agent profile retrieved successfully',
        agent: {
          id: agent._id.toString(),
          officerId: agent.officerId,
          fullName: agent.fullName,
          email: agent.email,
          phoneNumber: agent.phoneNumber,
          position: agent.position,
          department: agent.department || '',
          officeName: agent.officeName,
          isActive: agent.isActive,
          assignedDistricts: agent.assignedDistricts || []
        }
      };

    } catch (error) {
      console.error('Get agent profile error:', error);
      return {
        success: false,
        message: 'Internal server error',
        errors: ['Failed to retrieve agent profile']
      };
    }
  }

  /**
   * Update agent profile
   */
  static async updateAgentProfile(agentId: string, updateData: ProfileUpdateData): Promise<AgentAuthResult> {
    try {
      await connectDB();

      const updatedAgent = await Agent.findByIdAndUpdate(
        agentId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true, select: '-password' }
      );

      if (!updatedAgent) {
        return {
          success: false,
          message: 'Agent not found',
          errors: ['Agent not found']
        };
      }

      return {
        success: true,
        message: 'Profile updated successfully',
        agent: {
          id: updatedAgent._id.toString(),
          officerId: updatedAgent.officerId,
          fullName: updatedAgent.fullName,
          email: updatedAgent.email,
          phoneNumber: updatedAgent.phoneNumber,
          position: updatedAgent.position,
          department: updatedAgent.department || '',
          officeName: updatedAgent.officeName,
          isActive: updatedAgent.isActive,
          assignedDistricts: updatedAgent.assignedDistricts || []
        }
      };

    } catch (error) {
      console.error('Update agent profile error:', error);
      return {
        success: false,
        message: 'Internal server error',
        errors: ['Failed to update agent profile']
      };
    }
  }

  /**
   * Logout agent (invalidate tokens on client side)
   */
  static async logoutAgent(): Promise<AgentAuthResult> {
    return {
      success: true,
      message: 'Logout successful'
    };
  }
}

export default AgentAuthService;
