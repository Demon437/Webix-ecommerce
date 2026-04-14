# Admin Dashboard Quick Reference

## 🚀 Quick Start

### 1. Setup Admin User
```bash
cd ecommerce-backend
node script.js
```

### 2. Login
- Email: `admin@ecommerce.com`
- Password: `Admin@123456`

### 3. Access Admin Panel
- Click user profile → "📊 Admin Dashboard"

---

## 📍 Routes

| Page | URL | Function |
|------|-----|----------|
| Dashboard | `/admin/dashboard` | Overview & Analytics |
| Products | `/admin/products` | Product Management |
| Orders | `/admin/orders` | Order Management |
| Users | `/admin/users` | User Management |

---

## 🎯 What You Can Do

### Dashboard
- 📊 View sales analytics
- 📈 See revenue trends
- 📦 Check product count
- 💰 Monitor total revenue
- 👥 See user count

### Products
- 🔍 Search products
- ✏️ Edit product details
- 🗑️ Delete products
- ➕ Add new products (UI ready)

### Orders
- 🔍 Search orders
- 📋 View order details
- 📅 Check order dates
- 💵 See order amounts
- ⚡ Monitor order status

### Users
- 🔍 Search users
- 👑 Promote to admin
- 🗑️ Remove users
- 📅 View join dates
- 👤 See user roles

---

## 🔐 Security

### Default Login
```
Email: admin@ecommerce.com
Password: Admin@123456
```

### ⚠️ Must Change Password
After first login, update your password immediately:
1. Click profile → Profile Settings
2. Change password to something secure
3. Never use default password in production

---

## 📊 Dashboard Stats

Four main widgets showing:
1. **Total Products** - Count of all products
2. **Total Orders** - Count of customer orders
3. **Total Users** - Count of registered users
4. **Total Revenue** - Sum of order amounts

---

## 🔄 Common Tasks

### Add a Product
1. Go to Products page
2. Click "Add Product" button
3. Fill in product details
4. Save

### View Customer Order
1. Go to Orders page
2. Search or scroll to find order
3. Click "View Details" button

### Make User an Admin
1. Go to Users page
2. Find the user
3. Click shield icon
4. Confirm promotion

### Delete a Product
1. Go to Products page
2. Find product
3. Click trash icon
4. Confirm deletion

---

## 📱 Mobile Support

Admin dashboard is fully responsive:
- ✅ Mobile-friendly
- ✅ Touch-friendly buttons
- ✅ Optimized tables
- ✅ Full functionality on mobile/tablet

---

## 🎨 UI Components

All pages use:
- Dark theme (professional look)
- Consistent navigation
- Search functionality
- Action buttons
- Data tables
- Status badges
- Chart visualizations

---

## 🆘 Forgot Password?

### Reset Admin Password
```bash
cd ecommerce-backend
node script.js
```

This resets password to `Admin@123456`

---

## 📋 File Locations

**Backend Script:**
```
ecommerce-backend/script.js
```

**Admin Pages:**
```
src/pages/admin/
  ├── Dashboard.jsx
  ├── Products.jsx
  ├── Orders.jsx
  └── Users.jsx
```

**Layouts:**
```
src/AdminLayout.jsx
src/Layout.jsx
```

**Config:**
```
src/pages.config.js (updated)
src/App.jsx (updated)
```

---

## ✨ Features Implemented

- ✅ Admin authentication system
- ✅ Role-based access control
- ✅ Four admin pages with full UI
- ✅ Search functionality
- ✅ Data visualization (charts)
- ✅ CRUD operations (UI)
- ✅ Responsive design
- ✅ Dark theme
- ✅ Admin menu in navbar
- ✅ Protected routes

---

## 🔗 Navigation Flow

```
Home Page
   ↓
Login/Sign Up
   ↓
User Profile Menu
   ├─→ My Orders
   ├─→ Profile Settings
   ├─→ Admin Dashboard (if admin)
   │    ├─→ Dashboard
   │    ├─→ Products
   │    ├─→ Orders
   │    └─→ Users
   └─→ Sign Out
```

---

## 💡 Tips

1. **Search First** - Use search to quickly find items
2. **Check Status** - Order status shows at a glance
3. **Back Button** - Available on all sub-pages
4. **Logout** - Always logout from admin panel
5. **Refresh** - Press F5 to refresh data

---

## 🚨 Important

- ⚠️ Admin panel is password protected
- ⚠️ Only admins can access
- ⚠️ Change default password immediately
- ⚠️ Keep credentials secure
- ⚠️ Log out when done

---

**Last Updated:** February 26, 2026
**Status:** ✅ Ready to Use
