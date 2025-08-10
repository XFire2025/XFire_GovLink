import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/user-jwt';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/userSchema';

// Define types for profile updates
interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;  // Frontend uses this
  mobileNumber?: string; // Database uses this
  address?: string;
  profilePicture?: string;
  nationality?: string;
  dateOfBirth?: Date;
  gender?: string;
  nic?: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Access token not found' },
        { status: 401 }
      );
    }

    // Verify the access token
    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch {
      return NextResponse.json(
        { message: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user in database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return user profile data
    return NextResponse.json(
      { 
        message: 'Profile retrieved successfully',
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          nic: user.nic,
          mobileNumber: user.mobileNumber,
          phoneNumber: user.mobileNumber, // Add compatibility mapping
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          district: user.district,
          province: user.province,
          postalCode: user.postalCode,
          profilePicture: user.profilePicture,
          accountStatus: user.accountStatus,
          isEmailVerified: user.isEmailVerified,
          preferredLanguage: user.preferredLanguage,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Access token not found' },
        { status: 401 }
      );
    }

    // Verify the access token
    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch {
      return NextResponse.json(
        { message: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    // Parse request body
    const updateData = await request.json();
    console.log('Profile update request data:', updateData);

    // Define allowed fields that can be updated
    const allowedFields = [
      'firstName',
      'lastName',
      'fullName',
      'mobileNumber', // Using correct field name from schema
      'phoneNumber',  // Allow both for compatibility
      'dateOfBirth',
      'address',
      'district',
      'province',
      'postalCode',
      'profilePicture',
      'preferredLanguage'
    ];

    // Filter only allowed fields from request
    const filteredData: Partial<ProfileUpdateData> = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        // Map phoneNumber to mobileNumber for schema compatibility
        if (key === 'phoneNumber') {
          filteredData['mobileNumber' as keyof ProfileUpdateData] = updateData[key];
        } else {
          filteredData[key as keyof ProfileUpdateData] = updateData[key];
        }
      }
    });

    console.log('Filtered data for update:', filteredData);

    // Custom validation for updated fields only
    if (filteredData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(filteredData.email)) {
        return NextResponse.json(
          { message: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Validate phone number if provided
    if (filteredData.mobileNumber) {
      const mobileRegex = /^(\+94|0)([7][01245678]\d{7})$/;
      if (typeof filteredData.mobileNumber === 'string' && !mobileRegex.test(filteredData.mobileNumber.replace(/\s+/g, ''))) {
        return NextResponse.json(
          { message: 'Invalid Sri Lankan mobile number format' },
          { status: 400 }
        );
      }
    }

    // Validate age if date of birth is provided
    if (filteredData.dateOfBirth) {
      const birthDate = new Date(filteredData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        return NextResponse.json(
          { message: 'User must be at least 18 years old' },
          { status: 400 }
        );
      }
    }

    // Sync fullName with firstName and lastName if any of them is updated
    if (filteredData.firstName || filteredData.lastName) {
      const user = await User.findById(decoded.userId);
      const firstName = filteredData.firstName || user.firstName;
      const lastName = filteredData.lastName || user.lastName;
      filteredData.fullName = `${firstName} ${lastName}`.trim();
    }

    // Connect to database
    await connectToDatabase();

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        ...filteredData,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: false // Disable validation for partial updates
      }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate profile completion percentage
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'nic', 'mobileNumber'];
    const optionalFields = ['address', 'district', 'province', 'postalCode', 'profilePicture'];
    
    const completedRequired = requiredFields.filter(field => updatedUser[field]).length;
    const completedOptional = optionalFields.filter(field => updatedUser[field]).length;
    
    const profileCompletionPercentage = Math.round(
      ((completedRequired / requiredFields.length) * 70) + 
      ((completedOptional / optionalFields.length) * 30)
    );

    const isProfileComplete = completedRequired === requiredFields.length;

    // Return updated user data
    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id.toString(),
          email: updatedUser.email,
          role: updatedUser.role,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          fullName: updatedUser.fullName,
          nic: updatedUser.nic,
          mobileNumber: updatedUser.mobileNumber,
          dateOfBirth: updatedUser.dateOfBirth,
          address: updatedUser.address,
          district: updatedUser.district,
          province: updatedUser.province,
          postalCode: updatedUser.postalCode,
          profilePicture: updatedUser.profilePicture,
          accountStatus: updatedUser.accountStatus,
          isEmailVerified: updatedUser.isEmailVerified,
          isProfileComplete,
          profileCompletionPercentage,
          preferredLanguage: updatedUser.preferredLanguage,
          createdAt: updatedUser.createdAt,
          lastLogin: updatedUser.lastLogin,
          updatedAt: updatedUser.updatedAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
