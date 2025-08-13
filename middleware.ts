import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/user-jwt';

// Define protected routes for different user types
const PROTECTED_ROUTES = {
  // User/Citizen protected routes
  USER: [
    '/user/dashboard',
    '/user/profile',
    '/user/booking',
    '/user/chat',
    '/user/submission'
  ],
  // Agent protected routes
  AGENT: [
    '/agent/dashboard',
    '/agent/analytics',
    '/agent/appointments',
    '/agent/chat',
    '/agent/profile',
    '/agent/submissions'
  ],
  // Admin protected routes
  ADMIN: [
    '/admin/dashboard',
    '/admin/agents',
    '/admin/customer-agent',
    '/admin/reports',
    '/admin/suspension',
    '/admin/system-configuration',
    '/admin/users',
    '/admin/verification'
  ]
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/user/auth/login',
  '/user/auth/register',
  '/user/auth/forgot-password',
  '/agent/login',
  '/admin/login',
  '/api/auth/user/login',
  '/api/auth/user/register',
  '/api/auth/user/logout',
  '/api/auth/user/refresh',
  '/api/auth/user/verify-email',
  '/api/auth/admin/login',
  '/api/auth/admin/logout',
  '/api/auth/admin/refresh',
  '/api/auth/admin/initialize',
  '/api/auth/admin/logout',
  '/api/auth/admin/refresh',
  // '/api/auth/admin/create-default', // removed, now handled by create route
  '/api/auth/admin/create',
  '/verify-email',
  '/reset-password'
];

// Check if a path matches any of the protected routes
function isProtectedRoute(pathname: string, routeType: 'USER' | 'AGENT' | 'ADMIN'): boolean {
  return PROTECTED_ROUTES[routeType].some(route => 
    pathname.startsWith(route) || pathname === route
  );
}

// Check if a path is a public route
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route)
  );
}

// Get user info from token
async function getUserFromToken(token: string) {
  try {
    const decoded = verifyAccessToken(token);
    return decoded;
  } catch {
    return null;
  }
}

// Redirect to appropriate login page based on route type
function getLoginRedirect(pathname: string): string {
  if (pathname.startsWith('/admin')) {
    return '/admin/login';
  } else if (pathname.startsWith('/agent')) {
    return '/agent/login';
  } else {
    return '/user/auth/login';
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes (except auth), and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get tokens from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // If no access token, check if we can refresh
  if (!accessToken) {
    if (refreshToken) {
      // Try to refresh the token
      try {
        const refreshResponse = await fetch(`${request.nextUrl.origin}/api/auth/user/refresh`, {
          method: 'POST',
          headers: {
            'Cookie': `refresh_token=${refreshToken}`
          }
        });

        if (refreshResponse.ok) {
          const response = NextResponse.next();
          // Copy the new access token from the refresh response
          const setCookieHeader = refreshResponse.headers.get('set-cookie');
          if (setCookieHeader) {
            response.headers.set('set-cookie', setCookieHeader);
          }
          return response;
        }
      } catch {
        // Token refresh failed - will redirect to login
      }
    }

    // No valid tokens, redirect to login
    const loginUrl = new URL(getLoginRedirect(pathname), request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify access token and get user info
  const user = await getUserFromToken(accessToken);
  if (!user) {
    // Invalid token, clear cookies and redirect to login
    const response = NextResponse.redirect(new URL(getLoginRedirect(pathname), request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  // Check role-based access
  const userRole = user.role?.toUpperCase() as 'CITIZEN' | 'AGENT' | 'ADMIN';

  // For user/citizen routes
  if (isProtectedRoute(pathname, 'USER')) {
    if (userRole !== 'CITIZEN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // For agent routes
  if (isProtectedRoute(pathname, 'AGENT')) {
    if (userRole !== 'AGENT') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // For admin routes
  if (isProtectedRoute(pathname, 'ADMIN')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Check account status
  if (user.accountStatus === 'suspended' || user.accountStatus === 'deactivated') {
    const suspendedUrl = new URL('/account-suspended', request.url);
    return NextResponse.redirect(suspendedUrl);
  }

  // Add user info to headers for components to access
  const response = NextResponse.next();
  response.headers.set('x-user-id', user.userId);
  response.headers.set('x-user-role', user.role);
  response.headers.set('x-user-email', user.email);

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
