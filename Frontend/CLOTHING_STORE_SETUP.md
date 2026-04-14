# Men & Kids Clothing Store - Setup Guide

## Project Overview
This e-commerce project has been customized to focus exclusively on **Men's and Kids' Clothing**.

## Changes Made

### ✅ Frontend Changes
1. **Home Page Categories** (`FeaturedCategories.jsx`)
   - Updated to show only "Men" and "Kids" categories
   - Enhanced grid layout for 2 categories

2. **Navigation Bar** (`Navbar.jsx`)
   - Updated to display only Men and Kids in category dropdown
   - Clean, focused navigation

3. **Category Cards** (`CategoryCard.jsx`)
   - Updated with clothing-appropriate images
   - Men: Professional men's fashion image
   - Kids: Kids' fashion image

4. **Hero Banner** (`HeroBanner.jsx`)
   - Updated tagline: "Dress with Style & Confidence"
   - Messaging focused on premium men's and kids' clothing

5. **Product Filters** (`ProductFilters.jsx`)
   - Categories: Men, Kids only
   - Brands: Nike, Adidas, Puma, Levi's, Tommy Hilfiger, Gap

### ✅ Backend Changes
1. **Product Model** (`Product.js`)
   - Added clothing-specific fields:
     - `subcategory`: shirts, pants, jackets, shoes, accessories, sportswear
     - `sizes`: Array of available sizes
     - `colors`: Array of available colors
     - `material`: Fabric material information
     - `fit`: slim, regular, loose, custom
     - `is_featured`, `is_best_seller`, `is_trending`: For product highlights

## Setup Instructions

### 1. Initialize Categories
Run the seed script to create Men and Kids categories:

```bash
cd ecommerce-backend
node scripts/seedCategories.js
```

This will:
- Clear existing categories
- Create "Men" and "Kids" categories
- Display the category IDs for reference

### 2. Create Products
When creating products, ensure you:
- Assign them to either "Men" or "Kids" category
- Set a subcategory (shirts, pants, jackets, shoes, accessories, sportswear)
- Add sizes array: `["XS", "S", "M", "L", "XL", "XXL"]`
- Add colors array: `["Black", "White", "Blue", "Red", "Gray"]`
- Include material information: `"100% Cotton"` or similar
- Set fit type: `"regular"` (or slim, loose, custom)
- Upload 2-3 product images

### 3. Featured Products
Mark products as featured for homepage display:
- Set `is_featured: true` for featured products section
- Set `is_best_seller: true` for best sellers section
- Set `is_trending: true` for trending section

## Product Data Example (JSON)

```json
{
  "title": "Classic Cotton T-Shirt",
  "description": "Comfortable everyday t-shirt made from premium cotton",
  "price": 29.99,
  "stock": 100,
  "category": "CATEGORY_ID_FOR_MEN",
  "subcategory": "shirts",
  "brand": "Nike",
  "sizes": ["S", "M", "L", "XL", "XXL"],
  "colors": ["Black", "White", "Blue", "Gray"],
  "material": "100% Organic Cotton",
  "fit": "regular",
  "images": ["url1", "url2", "url3"],
  "rating": 4.5,
  "is_featured": true,
  "is_best_seller": false,
  "is_trending": false
}
```

## API Endpoints

### Categories
- `GET /api/category` - Get all categories
- `POST /api/category` - Create new category (Admin only)

### Products
- `GET /api/product` - Get all products
- `GET /api/product?category=men` - Filter by category
- `GET /api/product?search=shirt` - Search products
- `POST /api/product` - Create product (Admin only)
- `PUT /api/product/:id` - Update product (Admin only)
- `DELETE /api/product/:id` - Delete product (Admin only)

## Folder Structure

```
ecommerce-backend/
├── scripts/
│   └── seedCategories.js     // Run this to initialize categories
├── src/
│   ├── models/
│   │   ├── Category.js        // Category schema
│   │   └── Product.js         // Updated with clothing fields
│   ├── controllers/
│   ├── routes/
│   └── ...

src/ (Frontend)
├── components/
│   ├── home/
│   │   ├── FeaturedCategories.jsx  // Men & Kids only
│   │   ├── HeroBanner.jsx          // Updated messaging
│   │   └── ...
│   ├── ecommerce/
│   │   ├── CategoryCard.jsx        // Updated images
│   │   ├── Navbar.jsx              // Men & Kids only
│   │   └── ...
│   └── products/
│       └── ProductFilters.jsx      // Men & Kids categories
└── ...
```

## Next Steps

1. ✅ Run the seed script to create categories
2. ✅ Create admin user for managing products
3. ✅ Add Men's clothing products (20-30+ items)
4. ✅ Add Kids' clothing products (15-20+ items)
5. ✅ Set product images from Cloudinary or image service
6. ✅ Configure payment gateway (checkout expects PaymentMethod)
7. ✅ Test filtering and search functionality
8. ✅ Customize colors and branding as needed

## Customization Tips

- **Change accent color**: Update Tailwind classes (currently amber/orange)
- **Add more subcategories**: Edit Product model subcategory enum
- **Add more brands**: Update ProductFilters.jsx brands array
- **Update images**: Replace image URLs in CategoryCard.jsx
- **Styling**: All components use Tailwind CSS with shadcn/ui components

## Support

For any issues with category filtering or product display:
- Ensure categories are created with exact names: "men", "kids"
- Check that products have valid category ObjectIds
- Verify that images URLs are accessible
- Check browser console for API errors

---

**Project Focus**: Premium Men's and Kids' Clothing
**Built with**: React, Node.js, MongoDB, Tailwind CSS
**Last Updated**: February 2026
