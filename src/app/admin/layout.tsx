// app/admin/layout.tsx
"use client";
import AdminSidebar from "@/components/adminSystem/AdminSidebar";
import AdminNavbar  from "@/components/adminSystem/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-background via-background to-muted/5">
          {children}
        </main>
      </div>
    </div>
  );
}
