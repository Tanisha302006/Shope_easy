const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');
const products = require('./data/products');

dotenv.config({ path: '../.env' });
connectDB();

const importData = async () => {
  try {
    // Clear out databases completely
    await Product.deleteMany();
    await User.deleteMany();

    // Create an Admin user
    const createdUsers = await User.create([
      {
         name: 'Admin User',
         email: 'admin@shopeasy.com',
         password: 'password123',
         isAdmin: true
      }
    ]);

    // Insert dummy products safely
    await Product.insertMany(products);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with Seeder: ${error.message}`);
    process.exit(1);
  }
};

importData();
