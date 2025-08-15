// app/dashboard/layout.tsx
// import { ClerkProvider } from '@clerk/nextjs';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Add Sidebar here later */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
