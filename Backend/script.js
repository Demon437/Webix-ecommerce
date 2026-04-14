/**
 * Admin Setup Script
 * Run this script to create an admin user or reset admin password
 * Usage: node script.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin@123456';
const ADMIN_EMAIL = 'admin@ecommerce.com';

async function setupAdmin() {
    try {
        // Connect to database
        await connectDB();
        console.log('✅ Database connected');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: ADMIN_EMAIL });

        if (adminExists) {
            console.log('\n⚠️  Admin user already exists!');
            console.log('📧 Email:', ADMIN_EMAIL);
            console.log('🔑 Password: Use your existing password');
            console.log('\n💡 To reset password, run this script again and it will update the password.');

            // Update password and ensure role is admin
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            adminExists.password = hashedPassword;
            adminExists.role = 'admin'; // Ensure role is admin
            await adminExists.save();
            console.log('✅ Admin password has been reset!');
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            const adminUser = new User({
                name: 'Admin',
                email: ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin'
            });

            await adminUser.save();
            console.log('\n✅ Admin user created successfully!');
        }

        console.log('\n🎯 Admin Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', ADMIN_EMAIL);
        console.log('🔑 Password:', ADMIN_PASSWORD);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n💡 IMPORTANT: Change this password after first login!');
        console.log('💡 You can now login to the admin panel.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up admin:', error.message);
        process.exit(1);
    }
}

setupAdmin();
