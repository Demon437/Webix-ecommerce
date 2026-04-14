require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Category = require("../src/models/Category");

const seedCategories = async () => {
    try {
        await connectDB();

        // Clear existing categories
        await Category.deleteMany({});
        console.log("✓ Cleared existing categories");

        // Create categories with subcategories
        const categories = await Category.insertMany([
            {
                name: "Electronics",
                description: "Electronics and gadgets",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
                subcategories: [
                    { name: "Headphones" },
                    { name: "Smartwatches" },
                    { name: "Monitors" },
                    { name: "Chargers" }
                ]
            },
            {
                name: "Clothing",
                description: "Clothing and wear",
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
                subcategories: [
                    { name: "T-Shirts" },
                    { name: "Jeans" },
                    { name: "Jackets" },
                    { name: "Sneakers" }
                ]
            },
            {
                name: "Home",
                description: "Home and living products",
                image: "https://images.unsplash.com/photo-1578482585108-dfca2f3dba36?w=500&h=500&fit=crop",
                subcategories: [
                    { name: "Bedding" },
                    { name: "Furniture" },
                    { name: "Lighting" },
                    { name: "Decor" }
                ]
            },
            {
                name: "Beauty",
                description: "Beauty and personal care",
                image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop",
                subcategories: [
                    { name: "Skincare" },
                    { name: "Haircare" },
                    { name: "Makeup" },
                    { name: "Oral Care" }
                ]
            },
            {
                name: "Sports",
                description: "Sports and outdoors",
                image: "https://images.unsplash.com/photo-1506131143519-a1ba0d5b6f10?w=500&h=500&fit=crop",
                subcategories: [
                    { name: "Yoga" },
                    { name: "Running" },
                    { name: "Fitness" },
                    { name: "Accessories" }
                ]
            },
            {
                name: "Men",
                description: "Men's clothing and accessories",
                image: "https://images.unsplash.com/photo-1523672712202-f4b92ac40737?w=500&h=500&fit=crop",
                subcategories: [
                    { name: "Shirts" },
                    { name: "Pants" },
                    { name: "Jackets" },
                    { name: "Shoes" },
                    { name: "Accessories" },
                    { name: "Sportswear" }
                ]
            },
            {
                name: "Kids",
                description: "Kids' clothing and accessories",
                image: "https://images.unsplash.com/photo-1503944583220-5e3f26f6cc33?w=500&h=500&fit=crop",
                subcategories: [
                    { name: "Boys Clothing" },
                    { name: "Girls Clothing" },
                    { name: "Unisex Clothing" },
                    { name: "Kids Shoes" },
                    { name: "Accessories" },
                    { name: "Sportswear" },
                    { name: "School Uniform" }
                ]
            },
            {
                name: "Books",
                description: "Books and media",
                image: "https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=500&h=500&fit=crop",
                subcategories: [
                    { name: "Fiction" },
                    { name: "Non-Fiction" },
                    { name: "Technical" },
                    { name: "History" }
                ]
            }
        ]);

        console.log("✓ Created categories with subcategories:");
        categories.forEach(cat => {
            console.log(`\n  📁 ${cat.name} (ID: ${cat._id})`);
            cat.subcategories.forEach(sub => {
                console.log(`     └─ ${sub.name}`);
            });
        });

        console.log("\n✅ Database seeded successfully!");
        console.log("\nNow you can:");
        console.log("1. Use the admin panel to add products");
        console.log("2. Filter products by these categories");
        console.log("3. Add products to categories as needed");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedCategories();
