/**
 * Direct Backend Login Test
 * Test if backend login endpoint works
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');
const connectDB = require('./src/config/db');

async function testLogin() {
    try {
        await connectDB();
        console.log('✅ Database connected\n');

        const email = 'admin@ecommerce.com';
        const password = 'Admin@123456';

        console.log('🔐 Testing Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', email);
        console.log('🔑 Password:', password);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Step 1: Find user
        console.log('Step 1️⃣: Looking for user...');
        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User NOT found!');
            process.exit(1);
        }
        console.log('✅ User found\n');

        // Step 2: Compare password
        console.log('Step 2️⃣: Comparing password...');
        console.log('Stored hash:', user.password.substring(0, 30) + '...');
        console.log('Input password:', password);

        const match = await bcrypt.compare(password, user.password);
        console.log('Comparison result:', match);
        console.log();

        if (!match) {
            console.log('❌ Password does NOT match!');
            console.log('This is why login is failing!\n');

            console.log('💡 Trying to hash password fresh...');
            const freshHash = await bcrypt.hash(password, 10);
            console.log('Fresh hash:', freshHash);
            console.log('');

            console.log('Updating user with fresh hash...');
            user.password = freshHash;
            await user.save();
            console.log('✅ Password updated!\n');

            console.log('Re-testing comparison...');
            const match2 = await bcrypt.compare(password, user.password);
            console.log('New comparison result:', match2);
            console.log();

            if (match2) {
                console.log('✅ NOW password matches!');
                console.log('Try login now! 🎉');
            }
        } else {
            console.log('✅ Password matches perfectly!');
            console.log('\n🔍 Issue is somewhere else:');
            console.log('1. Check if backend is running');
            console.log('2. Check if API endpoint is correct');
            console.log('3. Check network requests in browser DevTools');
            console.log('4. Make sure frontend is connecting to right backend URL');
        }

        console.log();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testLogin();
