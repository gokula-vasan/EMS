const axios = require('axios');

const testAdminEndpoint = async () => {
    try {
        // First login as admin
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@ems.com',
            password: 'admin123'
        });

        const token = loginResponse.data.token;
        console.log('Admin login successful, token:', token.substring(0, 20) + '...');

        // Test creating a new user
        const createUserResponse = await axios.post('http://localhost:5000/api/admin/users', {
            name: 'Test Employee',
            email: 'test@ems.com',
            password: 'test123',
            role: 'employee',
            department: 'Testing'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('User created successfully:', createUserResponse.data);

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
};

testAdminEndpoint();