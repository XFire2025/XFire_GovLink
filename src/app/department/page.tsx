// src/app/department/page.tsx
import { redirect } from 'next/navigation';

export default function DepartmentRootPage() {
  // Always redirect from the root of the department section to its dashboard.
  // The layout's middleware should handle authentication checks.
  redirect('/department/dashboard');
}