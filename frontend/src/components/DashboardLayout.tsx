import { Outlet, Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/lib/auth-context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function DashboardLayout({ requiredRole }: { requiredRole: UserRole }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role !== requiredRole) {
  return (
    <Navigate
      to={
        user.role === "cook"
          ? "/cook"
          : user.role === "admin"
          ? "/admin"
          : "/user"
      }
      replace
    />
  );
}

  
  // Inside DashboardLayout.tsx - Update the main wrapper and main tag
return (
  <SidebarProvider>
    <div className="h-screen flex w-full bg-[#FDFCFB] overflow-hidden">{/* Light Cream Background */}
      <AppSidebar  />
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Transparent Header to let the background show through */}
        <header className="h-20 flex items-center justify-between px-4 sm:px-8 bg-transparent">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hover:bg-orange-50 text-[#2D1B14]" />
            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />
            <h1 className="font-serif text-xl font-bold text-[#2D1B14]">
              HomeFeast
            </h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            Welcome back, <span className="text-orange-600">{user.name.split(' ')[0]}</span> 👋
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8">
          {/* This is where BrowseCooks.tsx content will inject */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>
);
}

// return (
  //   <SidebarProvider>
  //     <div className="min-h-screen flex w-full">
  //       <AppSidebar />
  //       <div className="flex-1 flex flex-col min-w-0">
  //         <header className="h-14 flex items-center justify-between gap-4 border-b px-6 bg-gradient-to-r from-background to-muted/40 backdrop-blur supports-[backdrop-filter]:bg-background/70 sticky top-0 z-10">
  
  //         <div className="flex items-center gap-3">
  //           <SidebarTrigger />
  //           <h1 className="font-display text-lg font-semibold tracking-tight">
  //             HomeFeast Dashboard
  //           </h1>
  //         </div>

  //         <div className="text-sm text-muted-foreground hidden sm:block">
  //           Welcome back 👋
  //         </div>

  //       </header>
  //         <main className="flex-1 p-6 md:p-8 bg-muted/30 overflow-auto">
  //           <Outlet />
  //         </main>
  //       </div>
  //     </div>
  //   </SidebarProvider>
  // );

