import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Item from './models/Item.js';
import Log from './models/Log.js';

// Load env vars
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Item.deleteMany({});
    await Log.deleteMany({});

    // Create default admin user
    console.log('Creating default admin user...');
    const admin = await User.create({
      username: 'admin',
      password: 'admin123',
      fullName: 'System Administrator',
      role: 'site_admin',
      isFirstLogin: false
    });

    console.log('Users created:');
    console.log('  - Admin: username=admin, password=admin123');

    // Create sample inventory items
    console.log('\nCreating sample inventory items...');
    const items = [
      {
        name: 'Laptop - Dell XPS 15',
        category: 'Electronics',
        quantity: 25,
        price: 1299.99,
        description: 'High-performance laptop for business use',
        lowStockThreshold: 10
      },
      {
        name: 'Wireless Mouse',
        category: 'Electronics',
        quantity: 150,
        price: 29.99,
        description: 'Ergonomic wireless mouse',
        lowStockThreshold: 20
      },
      {
        name: 'Office Chair',
        category: 'Furniture',
        quantity: 8,
        price: 249.99,
        description: 'Ergonomic office chair with lumbar support',
        lowStockThreshold: 10
      },
      {
        name: 'Notebook A4',
        category: 'Stationery',
        quantity: 200,
        price: 3.99,
        description: 'A4 ruled notebook, 100 pages',
        lowStockThreshold: 50
      },
      {
        name: 'Desk Lamp',
        category: 'Furniture',
        quantity: 5,
        price: 45.99,
        description: 'LED desk lamp with adjustable brightness',
        lowStockThreshold: 10
      },
      {
        name: 'USB-C Cable',
        category: 'Electronics',
        quantity: 75,
        price: 12.99,
        description: '2-meter USB-C charging cable',
        lowStockThreshold: 25
      },
      {
        name: 'Whiteboard Marker',
        category: 'Stationery',
        quantity: 45,
        price: 2.49,
        description: 'Dry-erase marker, assorted colors',
        lowStockThreshold: 30
      },
      {
        name: 'Monitor - 27" 4K',
        category: 'Electronics',
        quantity: 12,
        price: 399.99,
        description: '27-inch 4K UHD monitor',
        lowStockThreshold: 5
      },
      {
        name: 'Desk Organizer',
        category: 'Furniture',
        quantity: 30,
        price: 19.99,
        description: 'Multi-compartment desk organizer',
        lowStockThreshold: 15
      },
      {
        name: 'Printer Paper',
        category: 'Stationery',
        quantity: 100,
        price: 8.99,
        description: 'A4 printer paper, 500 sheets per ream',
        lowStockThreshold: 20
      }
    ];

    const createdItems = await Item.insertMany(items);
    console.log(`Created ${createdItems.length} sample inventory items`);

    // Create initial logs
    console.log('\nCreating initial activity logs...');
    const logs = [
      {
        action: 'USER_CREATED',
        reason: 'System initialization',
        details: 'Default admin user created',
        userId: admin._id,
        username: admin.username,
        timestamp: new Date()
      },
      {
        action: 'ADD',
        reason: 'Initial inventory setup',
        details: 'Sample inventory items added to system',
        userId: admin._id,
        username: admin.username,
        timestamp: new Date()
      }
    ];

    await Log.insertMany(logs);
    console.log('Initial activity logs created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Items: ${await Item.countDocuments()}`);
    console.log(`   Logs: ${await Log.countDocuments()}`);
    console.log('\n🔐 Login credentials:');
    console.log('   Admin:  username=admin,  password=admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
