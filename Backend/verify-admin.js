/**
 * Database Verification Script
 * Check if admin user was created correctly
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const connectDB = require('./src/config/db');

async function verifyAdmin() {
    try {
        await connectDB();
        console.log('✅ Database connected\n');

        const user = await User.findOne({ email: 'admin@ecommerce.com' });

        if (!user) {
            console.log('❌ Admin user NOT found in database!');
            console.log('\n💡 Run this command to create admin:');
            console.log('   node script.js\n');
            process.exit(1);
        }

        console.log('✅ Admin user FOUND in database!\n');
        console.log('📋 User Details:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', user.email);
        console.log('👤 Name:', user.name);
        console.log('🔐 Password Hash:', user.password.substring(0, 20) + '...');
        console.log('👑 Role:', user.role || 'NOT SET!');
        console.log('🔑 ID:', user._id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Verify password
        const bcrypt = require('bcryptjs');
        const matches = await bcrypt.compare('Admin@123456', user.password);
        console.log('🔍 Password Verification:');
        if (matches) {
            console.log('✅ Password "Admin@123456" matches the hash!');
            console.log('\n🎯 You can login with:');
            console.log('   📧 Email: admin@ecommerce.com');
            console.log('   🔑 Password: Admin@123456');
        } else {
            console.log('❌ Password does NOT match!');
            console.log('💡 Run script.js again to reset password');
        }

        console.log();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n⚠️  Make sure:');
        console.error('1. MongoDB is running');
        console.error('2. .env file has correct DATABASE_URL');
        console.error('3. Backend dependencies are installed (npm install)');
        process.exit(1);
    }
}

verifyAdmin();
