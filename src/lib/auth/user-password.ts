import bcrypt from 'bcryptjs';

// Salt rounds for bcrypt (higher = more secure but slower)
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');

// Password strength requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false, // Made optional for government users
  commonPasswords: [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    'srilanka', 'colombo', 'govlink'
  ]
};

// Password strength levels
export enum PasswordStrength {
  VERY_WEAK = 0,
  WEAK = 1,
  FAIR = 2,
  GOOD = 3,
  STRONG = 4
}

// Hash password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Validate password before hashing
    const validation = validatePassword(password);
    if (!validation.isValid) {
      throw new Error(`Password validation failed: ${validation.errors.join(', ')}`);
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Password hashing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Verify password against hash
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error(`Password verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Validate password strength and requirements
export const validatePassword = (password: string): { 
  isValid: boolean; 
  errors: string[];
  strength: PasswordStrength;
  suggestions: string[];
} => {
  const errors: string[] = [];
  const suggestions: string[] = [];

  // Check length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
    suggestions.push('Add more characters to your password');
  }
  
  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    errors.push(`Password must be no more than ${PASSWORD_REQUIREMENTS.maxLength} characters long`);
  }

  // Check character requirements
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
    suggestions.push('Add uppercase letters (A-Z)');
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
    suggestions.push('Add lowercase letters (a-z)');
  }

  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
    suggestions.push('Add numbers (0-9)');
  }

  if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
    suggestions.push('Add special characters (!@#$%^&*)');
  }

  // Check for common passwords
  if (PASSWORD_REQUIREMENTS.commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common');
    suggestions.push('Use a more unique password');
  }

  // Check for sequential characters
  if (/123|abc|qwe/i.test(password)) {
    suggestions.push('Avoid sequential characters');
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Avoid repeated characters');
  }

  // Calculate password strength
  const strength = calculatePasswordStrength(password);

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    suggestions: errors.length === 0 ? [] : suggestions
  };
};

// Calculate password strength score
export const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;

  // Length bonus
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety bonus
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

  // Penalty for common patterns
  if (/123|abc|qwe/i.test(password)) score -= 1;
  if (/(.)\1{2,}/.test(password)) score -= 1;
  if (PASSWORD_REQUIREMENTS.commonPasswords.includes(password.toLowerCase())) score -= 2;

  // Ensure score is within bounds
  score = Math.max(0, Math.min(4, score));

  return score as PasswordStrength;
};

// Generate password strength description
export const getPasswordStrengthText = (strength: PasswordStrength): { text: string; color: string } => {
  switch (strength) {
    case PasswordStrength.VERY_WEAK:
      return { text: 'Very Weak', color: '#FF4444' };
    case PasswordStrength.WEAK:
      return { text: 'Weak', color: '#FF8800' };
    case PasswordStrength.FAIR:
      return { text: 'Fair', color: '#FFBB00' };
    case PasswordStrength.GOOD:
      return { text: 'Good', color: '#88BB00' };
    case PasswordStrength.STRONG:
      return { text: 'Strong', color: '#00AA00' };
    default:
      return { text: 'Unknown', color: '#666666' };
  }
};

// Generate secure random password
export const generateSecurePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Check if password needs to be updated (e.g., too old)
export const isPasswordExpired = (lastPasswordChange: Date, maxAge: number = 90): boolean => {
  const daysSinceChange = (Date.now() - lastPasswordChange.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceChange > maxAge;
};

// Compare password with user's previous passwords (to prevent reuse)
export const isPasswordReused = async (newPassword: string, previousHashes: string[]): Promise<boolean> => {
  for (const hash of previousHashes) {
    if (await verifyPassword(newPassword, hash)) {
      return true;
    }
  }
  return false;
};
