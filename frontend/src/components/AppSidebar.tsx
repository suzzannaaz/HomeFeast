import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
  
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  ChefHat, ClipboardList, Users, ShieldCheck, LogOut, User,
  Home, UtensilsCrossed, Package, Star, UserCog, CalendarDays, CalendarCheck
} from "lucide-react";

const navByRole = {
  user: [
    { title: "Dashboard", url: "/user", icon: Home }, // ✅ ADD THIS
    { title: "Browse Cooks", url: "/user/cooks", icon: ChefHat },
    { title: "My Orders", url: "/user/orders", icon: Package },
    { title: "My Profile", url: "/user/profile", icon: User },
    { title: "Subscriptions", url: "/user/subscriptions", icon: Star },
  ],
  cook: [
  {title: "Today's Schedule",url: "/cook/schedule", icon: CalendarCheck},
  { title: "Kitchen Profile", url: "/cook/profile", icon: UserCog }, // Step 1
  { title: "Menu Manager", url: "/cook/menu", icon: UtensilsCrossed }, // Step 2
  { title: "Active Orders", url: "/cook/orders", icon: ClipboardList }, // Step 3
  { title: "Subscriptions", url: "/cook/subscriptions", icon: CalendarDays }, // Step 4
  { title: "Reviews & Ratings", url: "/cook/reviews", icon: Star }, // Step 5
],
  admin: [
    { title: "Dashboard", url: "/admin", icon: ShieldCheck }, // ✅ ADD
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Cooks", url: "/admin/cooks", icon: ChefHat },
    { title: "Orders", url: "/admin/orders", icon: Package },
    { title: "Subscriptions", url: "/admin/subscriptions", icon: CalendarDays },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;
  const items = navByRole[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

// Inside AppSidebar.tsx - Update the return statement colors
return (
  <Sidebar
  collapsible="offcanvas"
  className="border-none bg-[#2D1B14] text-[#EAD7C3]"
>
    <SidebarContent className="bg-[#2D1B14]">
      <SidebarGroup>
        <SidebarGroupLabel className="h-20 mb-4">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2.5 rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-900/20">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            {!collapsed && (
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                HomeFeast
              </span>
            )}
          </div>
        </SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu className="gap-1 px-2">
            {items.map((item) => {
              const active = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`group flex items-center gap-4 rounded-xl px-4 py-4 transition-all ${
                        active
                          ? "bg-orange-500/10 text-orange-500" 
                          : "text-[#EAD7C3]/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${active ? "text-orange-500" : ""}`} />
                      {!collapsed && (
                        <span className="text-sm font-semibold">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter className="bg-[#2D1B14] p-6 border-t border-white/5">
      {!collapsed && (
        <div className="mb-4 px-2 text-[11px] uppercase tracking-widest text-[#EAD7C3]/40 font-bold">
          {user.name} ({user.role})
        </div>
      )}
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="w-full justify-start gap-3 text-[#EAD7C3]/70 hover:bg-white/5 hover:text-white rounded-xl h-12"
      >
        <LogOut className="h-5 w-5" />
        {!collapsed && <span className="font-semibold">Logout</span>}
      </Button>
    </SidebarFooter>
  </Sidebar>
);
}


//   return (
//     <Sidebar collapsible="icon">
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>
//             <div className="flex items-center gap-2 px-1 py-2">
//               <div className="p-2 rounded-xl bg-sidebar-primary text-white shadow">
//                 <UtensilsCrossed className="h-4 w-4" />
//               </div>

//               {!collapsed && (
//                 <span className="font-display text-lg font-bold tracking-tight text-sidebar-foreground">
//                   HomeFeast
//                 </span>
//               )}
//             </div>
//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {items.map((item) => {
//                 const active = location.pathname.startsWith(item.url);
//                 return (
//                   <SidebarMenuItem key={item.url}>
//                     <SidebarMenuButton asChild>
//                       <Link
//                           to={item.url}
//                           className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
//                             active
//                               ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
//                               : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:translate-x-1"
//                           }`}
//                         >
//                           <div
//                             className={`flex items-center justify-center rounded-lg p-1.5 ${
//                               active
//                                 ? "bg-sidebar-primary text-white"
//                                 : "bg-sidebar-accent/40 group-hover:bg-sidebar-accent"
//                             }`}
//                           >
//                             <item.icon className="h-4 w-4" />
//                           </div>

//                           {!collapsed && (
//                             <span className="font-medium tracking-tight">{item.title}</span>
//                           )}
//                         </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 );
//               })}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter className="p-3">
//         {!collapsed && (
//           <div className="mb-2 text-xs text-sidebar-foreground/60 truncate">
//             {user.name} ({user.role})
//           </div>
//         )}
//         <Button
//   variant="ghost"
//   size={collapsed ? "icon" : "default"}
//   onClick={handleLogout}
//   className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
// >
//   <LogOut className="h-4 w-4" />
//   {!collapsed && <span>Logout</span>}
// </Button>
//       </SidebarFooter>
//     </Sidebar>
//   );