# 🍽️ HomeFeast

A full-stack web application that connects users with home cooks for ordering homemade meals. Built using the MERN stack with a focus on responsive UI and real-world features like subscriptions, orders, and role-based dashboards.

---

## 🚀 Features

### 👤 User

* Browse available cooks
* Place orders
* Subscribe to meal plans (daily/weekly/monthly)
* View orders and subscriptions
* Leave reviews and ratings

### 👨‍🍳 Cook

* Create and manage profile
* Add and update menu
* Accept/reject orders
* Manage subscriptions
* View reviews and ratings

### 🛠️ Admin

* Manage users
* Approve/reject cooks
* View all orders
* Manage subscriptions

---

## 🧑‍💻 Tech Stack

### Frontend

* React.js
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB

---

## 📱 Responsiveness

* Fully mobile-friendly UI
* Tables converted to card layouts on small screens
* Sidebar navigation optimized for all devices

---

## 🔐 Authentication

* JWT-based authentication
* Role-based access (User, Cook, Admin)

---

## 📦 Installation

```bash
# Clone the repo
git clone <your-repo-link>

# Install dependencies
npm install

# Run frontend
npm run dev

# Run backend
npm start
```

---

## 🔑 Environment Variables (.env)

Create a `.env` file in your backend root and add:

```env
MONGO_URI=mongodb://127.0.0.1:27017/homefeast
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

**Notes:**

* Replace `homefeast` with your database name if different.
* Keep `JWT_SECRET` strong and private.


---

## 📂 Project Structure

```
frontend/
backend/
```

---

## 🌟 Future Improvements

* Search & filter functionality
* Pagination
* Payment integration
* Notifications system

---

## 👩‍💻 Author

Suzzan Naaz

---

## 📌 Conclusion

HomeFeast is a real-world full-stack application designed to solve the problem of accessing homemade food easily while providing income opportunities for home cooks.
