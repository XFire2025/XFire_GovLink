// src/app/department/layout.tsx
"use client";
import { usePathname } from "next/navigation";
import DepartmentSidebar from "@/components/department/DepartmentSidebar";
import DepartmentNavbar from "@/components/department/DepartmentNavbar";

export default function DepartmentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/department/login';

  // If it's the login page, render without sidebar and navbar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For all other department pages, render with the main layout
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <DepartmentSidebar />
      <div className="flex-1 flex flex-col">
        <DepartmentNavbar />
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-background via-background to-muted/5">
          {children}
        </main>
      </div>
    </div>
  );
}