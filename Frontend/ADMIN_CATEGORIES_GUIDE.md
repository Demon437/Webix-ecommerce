# Admin Category Management Guide

## Overview
The Admin Category Management feature allows administrators to easily add, edit, and delete product categories for the e-commerce store. This guide will help you set up and use the category management system.

## Features

✅ **Add Categories** - Create new product categories with name, description, and image
✅ **Edit Categories** - Update existing category information
✅ **Delete Categories** - Remove categories from the store
✅ **Manage Subcategories** - Add and remove subcategories within each category
✅ **View All Categories** - See a complete list of all store categories
✅ **Admin Authentication** - Secure access for authorized admins only

## Setup Instructions

### 1. Backend Setup

Ensure your backend server is running:

```bash
cd ecommerce-backend
npm install
npm run dev
```

The backend should be running on `http://localhost:5000`

### 2. Frontend Setup

Make sure your frontend development server is running:

```bash
npm install
npm run dev
```

The frontend should be running on `http://localhost:5173` or `http://localhost:3000`

### 3. Admin User Setup

Create an admin user with these credentials:
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: admin

Or run the seed script to create a sample admin:

```bash
cd ecommerce-backend
npm run seed
```

## How to Use

### Accessing the Category Management Page

1. Navigate to the admin panel: `http://localhost:5173/admin/categories`
2. Log in with admin credentials (admin@example.com / admin123)
3. You'll see the Category Management dashboard

### Adding a New Category

1. Click the **"Add New Category"** button
2. Fill in the category details:
   - **Category Name** (required): Enter the category name (e.g., "Electronics", "Clothing")
   - **Description** (optional): Provide a detailed description
   - **Image URL** (optional): Add a category image/thumbnail URL
3. **Add Subcategories** (optional):
   - Enter a subcategory name in the input field
   - Click "Add" or press Enter
   - Remove subcategories by clicking the X button
4. Click **"Add Category"** to save

### Example: Adding an Electronics Category

```
Category Name: Electronics
Description: Latest electronics and gadgets for tech enthusiasts
Image URL: https://example.com/electronics-banner.jpg

Subcategories:
- Smartphones
- Laptops
- Accessories
- Tablets
```

### Editing a Category

1. Find the category you want to edit in the categories list
2. Click the **"Edit"** button on the category card
3. Modify the details as needed
4. Update subcategories if required
5. Click **"Update Category"** to save changes

### Deleting a Category

1. Find the category you want to delete
2. Click the **"Delete"** button on the category card
3. Confirm the deletion when prompted
4. The category will be permanently removed

### Viewing Category Details

Each category card displays:
- Category name
- Description
- Category image (if available)
- List of subcategories with badges
- Added date
- Edit and Delete action buttons

## API Endpoints

The admin category management uses these backend APIs:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get single category |
| POST | `/api/categories` | Create new category (Admin only) |
| PUT | `/api/categories/:id` | Update category (Admin only) |
| DELETE | `/api/categories/:id` | Delete category (Admin only) |
| POST | `/api/categories/:id/subcategories` | Add subcategory (Admin only) |
| DELETE | `/api/categories/:id/subcategories/:subcategoryId` | Delete subcategory (Admin only) |

## Testing the Feature

A test script is provided to verify all category management functionality:

```bash
node test-categories.js
```

This will test:
- Admin login
- Getting all categories
- Creating a new category
- Retrieving a single category
- Updating category information
- Adding subcategories
- Verifying updates
- Deleting categories
- Verifying deletion

## Troubleshooting

### "Failed to fetch categories"
- ✓ Ensure the backend server is running on `http://localhost:5000`
- ✓ Check that MongoDB is connected
- ✓ Check browser console for error messages

### "Category already exists"
- ✓ Category names must be unique
- ✓ Try renaming your category

### "Unauthorized" or authentication errors
- ✓ Ensure you're logged in as an admin
- ✓ Verify admin credentials are correct
- ✓ Check that your token hasn't expired

### "Failed to add subcategory"
- ✓ Subcategory names cannot be empty
- ✓ Duplicate subcategory names are not allowed
- ✓ Make sure the parent category exists

## Best Practices

1. **Unique Names**: Use descriptive, unique category names
2. **Clear Descriptions**: Provide clear descriptions for each category
3. **Professional Images**: Use high-quality, relevant category images
4. **Meaningful Subcategories**: Organize products logically with subcategories
5. **Regular Maintenance**: Keep categories updated and remove unused ones
6. **Consistent Naming**: Use consistent naming conventions across categories

## Example Category Structure

```
Electronics
├─ Smartphones
├─ Laptops & Computers
├─ Accessories
└─ Smart Home Devices

Clothing
├─ Men's Wear
├─ Women's Wear
├─ Kids' Wear
└─ Accessories

Home & Living
├─ Furniture
├─ Bedding
├─ Kitchen
└─ Decoration
```

## Security Notes

- ✓ Only admin users can add, edit, or delete categories
- ✓ All requests require authentication tokens
- ✓ Category operations are protected by role-based access control
- ✓ All data is validated on the backend

## Support Information

If you encounter any issues:

1. Check the browser console for error messages
2. Verify backend connection at `http://localhost:5000/api/categories`
3. Review server logs in the terminal
4. Ensure all required environment variables are set in `.env`

## Related Documentation

- See `ADMIN_SETUP.md` for initial admin setup
- See `ADMIN_QUICK_REFERENCE.md` for quick admin commands
- Check `CLOTHING_STORE_SETUP.md` for store-specific configuration

---

**Last Updated**: February 2026
**Version**: 1.0
