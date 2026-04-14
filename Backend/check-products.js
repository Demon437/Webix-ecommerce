const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

        const count = await Product.countDocuments();
        console.log('Total products in database:', count);

        const products = await Product.find({}).select('title price images category is_featured');
        console.log('\nProducts:');
        products.forEach((p, i) => {
            console.log(`${i + 1}. ${p.title} - Price: ₹${p.price} - Images: ${p.images?.length || 0} - Featured: ${p.is_featured}`);
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkProducts();
