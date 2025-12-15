const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Load Config
dotenv.config();

// 2. Connect to Database
connectDB();

// 3. Initialize App
const app = express();

// 4. Middleware
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'], 
    credentials: true
}));

// 5. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/manager', require('./routes/managerRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));
app.use('/api/settings', require('./routes/settingRoutes')); 

// 6. Test Route
app.get('/', (req, res) => res.send('API is running...'));

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));