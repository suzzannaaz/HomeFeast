// Dummy API layer - replace base URL with your Express backend
// const BASE = "/api";

// async function request(endpoint: string, options: RequestInit = {}) {
//   const token = localStorage.getItem("token");
//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     ...(options.headers as Record<string, string> || {}),
//   };
//   const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });
//   if (!res.ok) throw new Error(`API error: ${res.status}`);
//   return res.json();
// }

// export const api = {
//   auth: {
//     login: (data: { email: string; password: string }) =>
//       request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
//     register: (data: { name: string; email: string; password: string; role: string }) =>
//       request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
//     profile: () => request("/auth/profile"),
//     updateProfile: (data: Record<string, unknown>) =>
//       request("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
//   },
//   cooks: {
//     list: () => request("/cooks"),
//     get: (id: string) => request(`/cooks/${id}`),
//     approve: (id: string) => request(`/admin/cooks/${id}/approve`, { method: "PUT" }),
//     reject: (id: string) => request(`/admin/cooks/${id}/reject`, { method: "PUT" }),
//   },
//   orders: {
//     create: (data: Record<string, unknown>) =>
//       request("/orders", { method: "POST", body: JSON.stringify(data) }),
//     myOrders: () => request("/orders/my"),
//     cookOrders: () => request("/orders/cook"),
//     all: () => request("/orders"),
//     accept: (id: string) => request(`/orders/${id}/accept`, { method: "PUT" }),
//     reject: (id: string) => request(`/orders/${id}/reject`, { method: "PUT" }),
//     deliver: (id: string) => request(`/orders/${id}/deliver`, { method: "PUT" }),
//   },
//   reviews: {
//     create: (orderId: string, data: { rating: number; comment: string }) =>
//       request(`/orders/${orderId}/review`, { method: "POST", body: JSON.stringify(data) }),
//   },
//   admin: {
//     users: () => request("/admin/users"),
//     blockUser: (id: string) => request(`/admin/users/${id}/block`, { method: "PUT" }),
//     unblockUser: (id: string) => request(`/admin/users/${id}/unblock`, { method: "PUT" }),
//     cooks: () => request("/admin/cooks"),
//     orders: () => request("/admin/orders"),
//   },
// };


const API = "http://localhost:5000/api";

// Login API
export const loginApi = async (email: string, password: string) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  return data;
};


// ----------------------------
// Register API
export const registerApi = async (userData: {
  name: string;
  email: string;
  password: string;
  role: "user" | "cook";
  bio?: string;
  serviceArea?: string;
  deliveryTime?: string;
  cuisines?: string[];
}) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");

  return data; // Returns { user: {...}, token: "..." }
};

// Get cooks API
export const getCooksApi = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/users/cooks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch cooks");

  return data;
};

// // create order
// export const createOrderApi = async (token: string | null, cookId: string, planType: string, deliveryTime: string) => {
//   const res = await fetch("http://localhost:5000/api/orders", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//     body: JSON.stringify({ cook: cookId, planType, deliveryTime }),
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to create order");
//   return data;
// };

//get order- user
export const getUserOrdersApi = async (token: string) => {
  const res = await fetch("http://localhost:5000/api/orders/my-orders", {
    method: "GET", // Must be GET
    headers: {
      
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
  return data;
};

// ✅ Cancel order
export const cancelOrderApi = async (token: string, orderId: string) => {
  const res = await fetch(`${API}/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to cancel order");

  return data;
};


//create review
export const createReviewApi = async (
  token: string,
  data: { cook: string; order: string; rating: number; comment: string }
) => {
  const res = await fetch("http://localhost:5000/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Failed to submit review");

  return result;
};

// lib/api.ts
export const getReviewedOrderIdsApi = async (token: string) => {
  const res = await fetch(`${API}/reviews/my-reviewed-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch reviewed orders");
  return res.json(); // Returns ["id1", "id2", ...]
};


const BASE_URL = "http://localhost:5000/api";
// ✅ Get profile
export const getMyProfileApi = async (token: string) => {
  const res = await fetch(`${BASE_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

  return data;
};

// ✅ Update profile
export const updateProfileApi = async (
  token: string,
  data: { name: string; email: string; location?: string }
) => {
  const res = await fetch(`${BASE_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Update failed");

  return result;
};


// ✅ Get all menus
export const getMenusByCookApi = async (cookId: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/menus/cook/${cookId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
};

// // ✅ Create subscription
// export const createSubscriptionApi = async (data: {
//   cook: string;
//   planType: string;
//   deliveryTime: string;
// }) => {
//   const token = localStorage.getItem("token");

//   const res = await fetch(`${API}/subscriptions`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   const result = await res.json();
//   if (!res.ok) throw new Error(result.message);

//   return result;
// };



// ✅ Create One-time Order (Trial/Daily)
export const createOrderApi = async (
  token: string, 
  cookId: string, 
  planType: string, 
  deliveryTime: string,
  date: string,
) => {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      cook: cookId, 
      planType, 
      deliveryTime,
      date,
    }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create order");

  return result;
};

// ✅ Create subscription (Keep your existing one)
export const createSubscriptionApi = async (data: {
  cook: string;
  planType: string;
  deliveryTime: string;
}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create subscription");

  return result;
};

// ✅ Get user subscriptions
export const getSubscriptionsApi = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/subscriptions`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
};

// ✅ Pause
export const pauseSubscriptionApi = async (id: string) => {
  const token = localStorage.getItem("token");

  return fetch(`${API}/subscriptions/${id}/pause`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Cancel
export const cancelSubscriptionApi = async (id: string) => {
  const token = localStorage.getItem("token");

  return fetch(`${API}/subscriptions/${id}/cancel`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Resume
export const resumeSubscriptionApi = async (id: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/subscriptions/${id}/resume`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to resume subscription");
  
  return result;
};


//filter cook
// ✅ Filter cooks
export const filterCooksApi = async (params: any) => {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${API}/cook/filter?${query}`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch cooks");

  return data;
};


const COOK_URL = "http://localhost:5000/api/cook";

export const getMyCookProfileApi = async (token: string) => {
  const res = await fetch(`${COOK_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null; // Important for checking if profile exists
  if (!res.ok) throw new Error("Failed to fetch cook profile");
  return res.json();
};

export const createCookProfileApi = async (token: string, data: any) => {
  const res = await fetch(`${COOK_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create profile");
  return result;
};

export const updateCookProfileApi = async (token: string, data: any) => {
  const res = await fetch(`${COOK_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update profile");
  return result;
};



const MENU_URL = "http://localhost:5000/api/menus";

export const createMenuApi = async (token: string, data: any) => {
  const res = await fetch(`${MENU_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateMenuApi = async (token: string, id: string, data: any) => {
  const res = await fetch(`${MENU_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteMenuApi = async (token: string, id: string) => {
  const res = await fetch(`${MENU_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

const ORDER_URL = "http://localhost:5000/api/orders";

export const getCookOrdersApi = async (token: string) => {
  const res = await fetch(`${ORDER_URL}/cook-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export const updateOrderStatusApi = async (token: string, orderId: string, action: 'accept' | 'reject' | 'delivered') => {
  const res = await fetch(`${ORDER_URL}/${orderId}/${action}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to ${action} order`);
  return res.json();
};

const SUB_URL = "http://localhost:5000/api/subscriptions";

export const getCookSubscriptionsApi = async (token: string) => {
  const res = await fetch(`${SUB_URL}/cook`, { // You'll need to add this route in Express
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const updateSubStatusApi = async (token: string, id: string, status: string) => {
  const res = await fetch(`${SUB_URL}/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

const REVIEW_URL = "http://localhost:5000/api/reviews";

// Get reviews specifically for the logged-in cook
export const getMyReviewsApi = async (token: string) => {
  const res = await fetch(`http://localhost:5000/api/reviews/my-reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// Get the star summary (Average + Total)
export const getMyRatingSummaryApi = async (token: string) => {
  const res = await fetch(`http://localhost:5000/api/reviews/my-rating`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};


// ================= ADMIN =================

// Get all cooks
export const getAllCooksApi = async (token: string) => {
  const res = await fetch(`${API}/admin/cooks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch cooks");
  return res.json();
};

// Approve cook
export const approveCookApi = async (token: string, id: string) => {
  const res = await fetch(`${API}/admin/cooks/${id}/approve`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to approve cook");
  return res.json();
};

// Reject cook
export const rejectCookApi = async (token: string, id: string) => {
  const res = await fetch(`${API}/admin/cooks/${id}/reject`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to reject cook");
  return res.json();
};

// Get all users
export const getAllUsersApi = async (token: string) => {
  const res = await fetch(`${API}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

// Delete user
export const deleteUserApi = async (token: string, id: string) => {
  const res = await fetch(`${API}/admin/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};

// Block/Unblock user
export const toggleBlockUserApi = async (token: string, id: string) => {
  const res = await fetch(`${API}/admin/users/${id}/block`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to update user status");
  return res.json();
};

// Get all orders
export const getAllOrdersApi = async (token: string) => {
  const res = await fetch(`${API}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

// Get orders by status (optional)
export const getOrdersByStatusApi = async (token: string, status: string) => {
  const res = await fetch(`${API}/admin/orders/${status}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch orders by status");
  return res.json();
};

// Get admin dashboard stats
export const getAdminStatsApi = async (token: string) => {
  const res = await fetch(`${API}/admin/stats`, { // Create this backend route
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json(); // { users: number, cooks: number, orders: number, subscriptions: number }
};

// Get all subscriptions
export const getAllSubscriptionsApi = async (token: string) => {
  const res = await fetch(`${API}/admin/subscriptions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch subscriptions");
  return res.json();
};

// Update subscription status
export const updateSubscriptionStatusApi = async (token: string, id: string, status: string) => {
  const res = await fetch(`${API}/admin/subscriptions/${id}/status`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to update subscription status");
  return res.json();
};

// export const approveCookApi = async (id: string) => {
//   const token = localStorage.getItem("token");
//   const res = await fetch(`http://localhost:5000/api/admin/cooks/${id}/approve`, {
//     method: "PUT",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) throw new Error("Failed to approve cook");
//   return res.json();
// };

// export const rejectCookApi = async (id: string) => {
//   const token = localStorage.getItem("token");
//   const res = await fetch(`http://localhost:5000/api/admin/cooks/${id}/reject`, {
//     method: "PUT",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) throw new Error("Failed to reject cook");
//   return res.json();
// };