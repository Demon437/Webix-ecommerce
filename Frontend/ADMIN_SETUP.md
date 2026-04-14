# Admin Dashboard Setup Guide

## 🎯 Overview

The admin dashboard has been successfully set up for your e-commerce project. It provides a complete admin panel with:

- **Dashboard**: Overview of sales, revenue, products, orders, and users
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **User Management**: Manage users and assign admin roles

---

## ✅ Setup Instructions

### Step 1: Install Required Packages (Backend)

Make sure you have all dependencies installed:

```bash
cd ecommerce-backend
npm install
```

Make sure `bcryptjs` is installed (for password hashing):
```bash
npm install bcryptjs
```

### Step 2: Create Admin User

Run the setup script to create an admin user:

```bash
node script.js
```

**Output:**
```
✅ Admin user created successfully!

🎯 Admin Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: admin@ecommerce.com
🔑 Password: Admin@123456
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 IMPORTANT: Change this password after first login!
```

---

## 🔐 Login to Admin Panel

### Step 1: Open Your Application
- Navigate to: `http://localhost:5173` (or your app URL)

### Step 2: Click Sign In
- Click the "Sign In" button in the navbar

### Step 3: Enter Admin Credentials
- **Email:** `admin@ecommerce.com`
- **Password:** `Admin@123456`

### Step 4: Access Admin Dashboard
- After login, click on your profile icon (top right)
- Select **"📊 Admin Dashboard"** from the dropdown menu
- Or navigate directly to: `/admin/dashboard`

---

## 📊 Admin Dashboard Pages

### 1. **Dashboard** (`/admin/dashboard`)
- Welcome message with admin name
- Key statistics (Total Products, Orders, Users, Revenue)
- Visual charts (Sales, Revenue trends)
- Quick access buttons to all admin sections

### 2. **Products** (`/admin/products`)
- View all products in your store
- Search products by name or SKU
- Edit product details
- Delete products
- Add new products button

### 3. **Orders** (`/admin/orders`)
- View all customer orders
- Search orders by ID or customer email
- View order status (Pending, Processing, Completed, Cancelled)
- View order date and total amount

### 4. **Users** (`/admin/users`)
- View all registered users
- Search users by name or email
- Promote users to admin role
- Delete user accounts
- View user registration date

---

## 🔑 Admin Features

### User Role System
```javascript
// User roles in the database
role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}
```

### Admin Indicators
- Admin panel is only visible to users with `role: "admin"`
- 💡 Admin users will see "📊 Admin Dashboard" link in their user menu
- Accessing admin pages without admin role will redirect to login

### Password Security
```
Default Password: Admin@123456

⚠️ IMPORTANT SECURITY NOTES:
1. Change the admin password immediately after first login
2. Use a strong, unique password
3. Never share admin credentials
4. Reset passwords if compromised
5. Keep the script.js file secure
```

---

## 🛠️ File Structure

```
ecommerce-backend/
  └── script.js                    # Admin setup script

src/
  ├── pages/
  │   └── admin/
  │       ├── Dashboard.jsx        # Main admin dashboard
  │       ├── Products.jsx         # Product management
  │       ├── Orders.jsx           # Order management
  │       └── Users.jsx            # User management
  ├── AdminLayout.jsx              # Admin layout wrapper
  ├── pages.config.js              # Updated with admin routes
  ├── App.jsx                      # Updated with admin routing
  └── components/ecommerce/
      └── Navbar.jsx               # Updated with admin link
```

---

## 🚀 Core Features Implemented

### Dashboard
- ✅ Admin greeting with username
- ✅ Stats cards (Products, Orders, Users, Revenue)
- ✅ Sales chart (Monthly sales bar chart)
- ✅ Revenue chart (Weekly revenue line chart)
- ✅ Quick access buttons
- ✅ Logout functionality

### Products Management
- ✅ List all products
- ✅ Search functionality
- ✅ Edit button (ready for implementation)
- ✅ Delete products
- ✅ Add new product button (ready for implementation)

### Orders Management
- ✅ List all orders
- ✅ Search by Order ID or customer email
- ✅ Order status badges (Pending, Processing, Completed, Cancelled)
- ✅ View order date and amount
- ✅ View order details button

### Users Management
- ✅ List all users
- ✅ Search users
- ✅ Promote users to admin
- ✅ Delete users
- ✅ View user join date
- ✅ Role indicators

---

## 🔄 Resetting Admin Password

To reset the admin password, simply run the script again:

```bash
node script.js
```

This will:
1. Check if admin already exists
2. Update the password to the default
3. Display the new credentials

---

## 🎨 Styling

All admin pages use:
- **Dark Theme** (Gray-900 background)
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Recharts** for data visualization
- **Lucide React** for icons

---

## 📝 Notes

### Authentication Flow
1. User logs in with email/password
2. If user has `role: "admin"`, admin link appears in dropdown
3. Admin pages check for admin role before rendering
4. Non-admin users are redirected to login

### Database Requirements
Make sure your User model includes the `role` field:

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" }
});
```

---

## ⚠️ Important Reminders

1. **Change Default Password**: Change `Admin@123456` immediately after setup
2. **Use Environment Variables**: Never hardcode credentials in production
3. **Enable SSL**: Use HTTPS in production for admin pages
4. **Regular Backups**: Keep your database backed up
5. **Audit Logs**: Consider implementing admin action logs
6. **Rate Limiting**: Protect admin routes with rate limiting

---

## 🐛 Troubleshooting

### Admin Dashboard Not Appearing

**Issue:** "Admin Dashboard" link not visible in user menu

**Solution:**
1. Verify user has `role: "admin"` in database
2. Check if user is logged in (`user` object exists)
3. Clear browser cache and refresh page

### "You are not authorized" error

**Issue:** Redirected to login when accessing admin pages

**Solution:**
1. Verify logged-in user is an admin
2. Run `node script.js` to create/reset admin
3. Login with correct admin credentials

### Script Error: "bcryptjs not found"

**Issue:** Running `node script.js` throws bcryptjs error

**Solution:**
```bash
npm install bcryptjs
node script.js
```

---

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify database connectivity
3. Ensure all required packages are installed
4. Review the backend logs

---

**Happy Managing! 🚀**
