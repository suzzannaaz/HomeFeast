import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from "@/components/DashboardLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

import BrowseCooks from "./pages/user/BrowseCooks";
import CookDetails from "./pages/user/CookDetails";
import MyOrders from "./pages/user/MyOrders";
import UserProfile from "./pages/user/UserProfile";
import UserDashboard from "./pages/user/UserDashboard"; // ✅ ADD THIS
import MySubscriptions from "./pages/user/MySubscriptions";

import CookProfileSetup from "./pages/cook/CookProfile";
import CookMenuManager from "./pages/cook/MenuManager";
import CookOrdersPage from "./pages/cook/Order";
import CookSubscriptionsPage from "./pages/cook/SubscriptionPage";
import CookDailySchedule from "./pages/cook/CookDailySchedule";
import CookReviewsPage from "./pages/cook/CookReviewPage";

import AdminDashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/ManageUser";
import CooksPage from "./pages/admin/ManageCook";
import OrdersPage from "./pages/admin/ManageOrders";
import SubscriptionsPage from "./pages/admin/ManageSub";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ✅ USER DASHBOARD ROUTES */}
          <Route path="/user" element={<DashboardLayout requiredRole="user" />}>
            
            {/* ✅ DEFAULT DASHBOARD */}
            <Route index element={<UserDashboard />} />

            {/* ✅ CHILD ROUTES */}
            <Route path="cooks" element={<BrowseCooks />} />
            <Route path="cooks/:id" element={<CookDetails />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="/user/subscriptions" element={<MySubscriptions />} />
          </Route>

          <Route element={<DashboardLayout requiredRole="cook" />}>
          <Route path="/cook/schedule" element={<CookDailySchedule />} />
          <Route path="/cook/profile" element={<CookProfileSetup />} />
          <Route path="/cook/menu" element={<CookMenuManager />} />
          <Route path="/cook/orders" element={<CookOrdersPage />} />
          <Route path="/cook/subscriptions" element={<CookSubscriptionsPage />} />
          <Route path="/cook/reviews" element={<CookReviewsPage />} />
          </Route>

        <Route element={<DashboardLayout requiredRole="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/cooks" element={<CooksPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/subscriptions" element={<SubscriptionsPage />} />
        </Route>


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;