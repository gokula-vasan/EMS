const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin user exists
        const existingAdmin = await User.findOne({ email: 'admin@ems.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Create test users
        const users = [
            {
                name: 'Admin User',
                email: 'admin@ems.com',
                password: 'admin123',
                role: 'admin',
                department: 'IT'
            },
            {
                name: 'Manager User',
                email: 'manager@ems.com',
                password: 'manager123',
                role: 'manager',
                department: 'HR'
            },
            {
                name: 'Employee User',
                email: 'employee@ems.com',
                password: 'employee123',
                role: 'employee',
                department: 'Development'
            }
        ];

        await User.insertMany(users);
        console.log('Test users created successfully!');
        console.log('Login credentials:');
        console.log('Admin: admin@ems.com / admin123');
        console.log('Manager: manager@ems.com / manager123');
        console.log('Employee: employee@ems.com / employee123');

    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedUser();