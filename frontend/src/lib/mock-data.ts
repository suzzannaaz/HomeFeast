// Mock data for development before backend is connected

export const mockCooks = [
  { _id: "c1", name: "Priya Sharma", cuisine: "North Indian", deliveryTime: "30 min", location: "Mumbai", rating: 4.8, approved: true, image: "" },
  { _id: "c2", name: "Chen Wei", cuisine: "Chinese", deliveryTime: "45 min", location: "Delhi", rating: 4.5, approved: true, image: "" },
  { _id: "c3", name: "Maria Garcia", cuisine: "Mexican", deliveryTime: "35 min", location: "Bangalore", rating: 4.9, approved: true, image: "" },
  { _id: "c4", name: "Yuki Tanaka", cuisine: "Japanese", deliveryTime: "40 min", location: "Hyderabad", rating: 4.7, approved: true, image: "" },
  { _id: "c5", name: "Fatima Al-Hassan", cuisine: "Middle Eastern", deliveryTime: "50 min", location: "Pune", rating: 4.6, approved: false, image: "" },
  { _id: "c6", name: "Luigi Romano", cuisine: "Italian", deliveryTime: "25 min", location: "Chennai", rating: 4.4, approved: true, image: "" },
];

export const mockOrders = [
  { _id: "o1", cookId: "c1", cookName: "Priya Sharma", planType: "daily", deliveryTime: "12:30 PM", status: "pending", createdAt: "2026-03-28", userId: "u1", userName: "John Doe" },
  { _id: "o2", cookId: "c2", cookName: "Chen Wei", planType: "weekly", deliveryTime: "1:00 PM", status: "accepted", createdAt: "2026-03-25", userId: "u1", userName: "John Doe" },
  { _id: "o3", cookId: "c3", cookName: "Maria Garcia", planType: "monthly", deliveryTime: "7:00 PM", status: "delivered", createdAt: "2026-03-20", userId: "u2", userName: "Jane Smith" },
  { _id: "o4", cookId: "c1", cookName: "Priya Sharma", planType: "daily", deliveryTime: "8:00 PM", status: "rejected", createdAt: "2026-03-27", userId: "u2", userName: "Jane Smith" },
];

export const mockUsers = [
  { _id: "u1", name: "John Doe", email: "john@example.com", role: "user" as const, blocked: false },
  { _id: "u2", name: "Jane Smith", email: "jane@example.com", role: "user" as const, blocked: false },
  { _id: "u3", name: "Bob Wilson", email: "bob@example.com", role: "user" as const, blocked: true },
];
