# Role-Based Access Control for Admin System

## Overview

Successfully implemented a two-level role-based access control system for the GovLink admin panel with **Super Admin** and **Admin** roles.

## Role Hierarchy

### Super Admin (SUPERADMIN)

- **Full system access** including all admin functionalities
- **Admin Management** privileges:
  - View all admins and super admins
  - Create new admins and super admins
  - Edit existing admin profiles
  - Delete admin accounts (with restrictions)
  - Change admin roles and account status
- **All standard admin privileges**

### Admin (ADMIN)

- **Standard admin access** to all system features except admin management
- **Cannot access**:
  - Admin Management menu
  - Admin creation, editing, or deletion
  - View other admin accounts

## Implementation Details

### 1. Database Schema Updates

- **Added `role` field** to Admin schema with enum values: `ADMIN`, `SUPERADMIN`
- **Default role**: `ADMIN` for newly created admins
- **Updated indexes** for efficient role-based queries

### 2. Authentication & Authorization

- **Updated JWT tokens** to include role information (`admin`/`superadmin`)
- **Enhanced middleware** to validate both admin and superadmin tokens
- **Role-based route protection** for admin management endpoints

### 3. User Interface Changes

- **Dynamic sidebar menu** based on admin role
- **Admin Management menu** only visible to super admins
- **Role indicators** throughout the interface
- **Permission-based UI components**

### 4. API Endpoints

#### Admin Management APIs (Super Admin Only)

- `GET /api/admin/admins` - List all admins
- `POST /api/admin/admins` - Create new admin
- `GET /api/admin/admins/[id]` - Get specific admin
- `PUT /api/admin/admins/[id]` - Update admin
- `DELETE /api/admin/admins/[id]` - Delete admin

#### Security Features

- **Self-protection**: Admins cannot delete their own accounts
- **Last super admin protection**: Cannot delete or demote the last super admin
- **Role validation**: All admin management operations require super admin privileges

### 5. Pages Structure

```
/admin/admin-management/
├── page.tsx                 # List all admins (Super Admin only)
├── create/
│   └── page.tsx            # Create new admin (Super Admin only)
└── edit/[id]/
    └── page.tsx            # Edit admin (Super Admin only)
```

## Test Credentials

### Super Admin

- **Email**: `superadmin@govlink.lk`
- **Password**: `ThisIsInsane`
- **Capabilities**: Full access including admin management

### Regular Admin

- **Email**: `admin@govlink.lk`
- **Password**: `TestAdmin123`
- **Capabilities**: All features except admin management

## Key Features

### 1. Role-Based Menu System

- Super admins see "Admin Management" menu between "Admin Dashboard" and "User Management"
- Regular admins see standard menu without admin management options

### 2. Permission Enforcement

- **Backend**: API endpoints validate super admin role
- **Frontend**: UI components check role before rendering
- **Middleware**: Route protection based on role

### 3. Security Safeguards

- Cannot delete the last super admin
- Cannot demote the last super admin to regular admin
- Admins cannot modify their own accounts through admin management

### 4. User Experience

- **Intuitive role badges**: Visual indicators for ADMIN vs SUPERADMIN
- **Status indicators**: Active, Suspended, Deactivated states
- **Search and filtering**: Easy admin discovery and management
- **Responsive design**: Works on all device sizes

## Usage Instructions

### For Super Admins

1. **Login** with super admin credentials
2. **Navigate** to "Admin Management" in the sidebar
3. **View all admins** in the system with their roles and status
4. **Create new admins** using the "Create Admin" button
5. **Edit existing admins** by clicking the action menu
6. **Delete admins** when necessary (with built-in protections)

### For Regular Admins

1. **Login** with admin credentials
2. **Access all standard features** (users, agents, reports, etc.)
3. **Admin Management menu is hidden** - no access to admin operations

## Technical Considerations

### Security

- **Role validation at multiple layers**: Database, API, and UI
- **JWT token security**: Role information embedded in secure tokens
- **Protection mechanisms**: Prevent system lockout scenarios

### Performance

- **Efficient database queries**: Indexed role field for fast lookups
- **Minimal overhead**: Role checks are lightweight and cached

### Maintainability

- **Clean separation of concerns**: Role logic isolated in appropriate modules
- **Type safety**: TypeScript interfaces for all role-related data
- **Consistent patterns**: Same authorization pattern throughout the application

## Future Enhancements

- **Granular permissions**: More specific permission sets
- **Audit logging**: Track admin management actions
- **Bulk operations**: Mass admin updates
- **Role templates**: Predefined permission sets
- **Multi-factor authentication**: Enhanced security for super admins

---

The role-based access control system is now fully functional and ready for production use. The system provides secure, scalable admin management with clear separation between super admin and regular admin capabilities.
