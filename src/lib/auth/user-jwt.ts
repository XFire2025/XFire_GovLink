import jwt, { SignOptions } from "jsonwebtoken";
import { IUser } from "../models/userSchema";

// JWT Secret keys (should be in environment variables)
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  "your-super-secret-refresh-key-change-in-production";

// Token expiration values
const getTokenExpiry = (
  envVar: string | undefined,
  defaultValue: string
): string => {
  return envVar || defaultValue;
};

// JWT Token payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: "citizen" | "agent" | "admin" | "superadmin";
  accountStatus: string;
  profileStatus: string;
  iat?: number;
  exp?: number;
}

// Token verification result interfaces
export interface RefreshTokenPayload {
  userId: string;
  email: string;
  tokenType: string;
}

export interface EmailVerificationPayload {
  userId: string;
  email: string;
  tokenType: string;
}

export interface PasswordResetPayload {
  userId: string;
  email: string;
  tokenType: string;
  timestamp: number;
}

// Generate access token (short-lived)
export const generateAccessToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: (user._id as string).toString(),
    email: user.email,
    role: user.role,
    accountStatus: user.accountStatus,
    profileStatus: user.profileStatus,
  };

  const options: SignOptions = {
    // @ts-expect-error - JWT library typing issue with string values
    expiresIn: getTokenExpiry(process.env.ACCESS_TOKEN_EXPIRY, "15m"),
    issuer: "govlink-sri-lanka",
    audience: "govlink-users",
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (user: IUser): string => {
  const payload = {
    userId: (user._id as string).toString(),
    email: user.email,
    tokenType: "refresh",
  };

  const options: SignOptions = {
    // @ts-expect-error - JWT library typing issue with string values
    expiresIn: getTokenExpiry(process.env.REFRESH_TOKEN_EXPIRY, "7d"),
    issuer: "govlink-sri-lanka",
    audience: "govlink-users",
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

// Generate email verification token
export const generateEmailVerificationToken = (user: IUser): string => {
  const payload = {
    userId: (user._id as string).toString(),
    email: user.email,
    tokenType: "email_verification",
  };

  const options: SignOptions = {
    // @ts-expect-error - JWT library typing issue with string values
    expiresIn: getTokenExpiry(process.env.EMAIL_TOKEN_EXPIRY, "24h"),
    issuer: "govlink-sri-lanka",
    audience: "govlink-users",
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

// Generate password reset token
export const generatePasswordResetToken = (user: IUser): string => {
  const payload = {
    userId: (user._id as string).toString(),
    email: user.email,
    tokenType: "password_reset",
    timestamp: Date.now(), // Add timestamp for additional security
  };

  const options: SignOptions = {
    // @ts-expect-error - JWT library typing issue with string values
    expiresIn: getTokenExpiry(process.env.RESET_TOKEN_EXPIRY, "1h"),
    issuer: "govlink-sri-lanka",
    audience: "govlink-users",
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

// Verify access token
export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "govlink-sri-lanka",
      audience: "govlink-users",
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Access token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid access token");
    } else {
      throw new Error("Token verification failed");
    }
  }
};

// Verify refresh token
export const verifyRefreshToken = (
  token: string
): { userId: string; email: string } => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: "govlink-sri-lanka",
      audience: "govlink-users",
    }) as RefreshTokenPayload;

    if (decoded.tokenType !== "refresh") {
      throw new Error("Invalid token type");
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Refresh token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid refresh token");
    } else {
      throw new Error("Refresh token verification failed");
    }
  }
};

// Verify email verification token
export const verifyEmailVerificationToken = (
  token: string
): { userId: string; email: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "govlink-sri-lanka",
      audience: "govlink-users",
    }) as EmailVerificationPayload;

    if (decoded.tokenType !== "email_verification") {
      throw new Error("Invalid token type");
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Email verification token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid email verification token");
    } else {
      throw new Error("Email verification token verification failed");
    }
  }
};

// Verify password reset token
export const verifyPasswordResetToken = (
  token: string
): { userId: string; email: string; timestamp: number } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "govlink-sri-lanka",
      audience: "govlink-users",
    }) as PasswordResetPayload;

    if (decoded.tokenType !== "password_reset") {
      throw new Error("Invalid token type");
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      timestamp: decoded.timestamp,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Password reset token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid password reset token");
    } else {
      throw new Error("Password reset token verification failed");
    }
  }
};

// Generate both access and refresh tokens
export const generateTokenPair = (user: IUser) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

// Extract token from Authorization header
export const extractTokenFromHeader = (
  authHeader: string | null
): string | null => {
  if (!authHeader) return null;

  // Handle "Bearer token" format
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Handle direct token
  return authHeader;
};

// Check if token is about to expire (within 5 minutes)
export const isTokenAboutToExpire = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload | null;
    if (!decoded || !decoded.exp) return true;

    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    return expirationTime - currentTime <= fiveMinutes;
  } catch {
    return true;
  }
};
