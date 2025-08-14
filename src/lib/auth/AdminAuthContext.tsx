import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "SUPERADMIN";
  accountStatus: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  lastLoginAt?: Date;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string; admin?: Admin }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  getAuthHeaders: () => { [key: string]: string };
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Get authorization headers for API calls
  const getAuthHeaders = useCallback(() => {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    // Note: With httpOnly cookies, we don't need to manually set Authorization headers
    // The cookies will be automatically included with credentials: 'include'

    return headers;
  }, []);

  // Refresh admin token
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/admin/refresh", {
        method: "POST",
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
        setIsAuthenticated(true);
        // Note: New tokens are set as httpOnly cookies by the endpoint

        return true;
      } else {
        setAdmin(null);
        setAccessToken(null);
        setIsAuthenticated(false);

        return false;
      }
    } catch (error) {
      console.error("Admin token refresh failed:", error);
      setAdmin(null);
      setAccessToken(null);
      setIsAuthenticated(false);

      return false;
    }
  }, []);

  // Check if admin is authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to get admin profile using cookies
        const response = await fetch("/api/auth/admin/me", {
          method: "GET",
          credentials: "include", // Include cookies
        });

        if (response.ok) {
          const adminData = await response.json();
          setAdmin(adminData.admin);
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          // Try to refresh token
          const refreshed = await refreshToken();
          if (!refreshed) {
            setAdmin(null);
            setAccessToken(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);
        setAdmin(null);
        setAccessToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [refreshToken]);

  // Admin login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdmin(data.admin);
        setIsAuthenticated(true);
        // Note: Access token is now stored in httpOnly cookie
        // We don't need to manage it in localStorage

        return { success: true, message: data.message, admin: data.admin };
      } else {
        return {
          success: false,
          message: data.message || "Admin login failed",
        };
      }
    } catch (error) {
      console.error("Admin login error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  };

  // Admin logout
  const logout = async () => {
    try {
      await fetch("/api/auth/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      setAdmin(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      // Note: Cookies are cleared by the logout endpoint
    }
  };

  const value = {
    admin,
    isLoading,
    isAuthenticated,
    accessToken,
    login,
    logout,
    refreshToken,
    getAuthHeaders,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
