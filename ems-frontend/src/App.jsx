import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './auth/AuthContext'; 
import API from './utils/axiosHelper';

// Layouts & Pages
import PortalLayout from './layouts/PortalLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/employee/Dashboard';
import Attendance from './pages/employee/Attendance';
import Leaves from './pages/employee/Leaves';
import Payroll from './pages/employee/Payroll';
import ManagerDashboard from './pages/manager/Dashboard';
import Team from './pages/manager/Team';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Settings from './pages/admin/Settings';
import PayrollAdmin from './pages/admin/PayrollAdmin';
import Profile from './pages/Profile';

function App() {

  // 👇 ADD THIS EFFECT TO HANDLE GLOBAL SETTINGS (Dark Mode)
  useEffect(() => {
    const applySettings = async () => {
      try {
        const { data } = await API.get('/settings'); // Fetch settings
        const htmlElement = document.documentElement;
        
        if (data.darkMode) {
          htmlElement.setAttribute('data-bs-theme', 'dark'); // Enable Bootstrap Dark Mode
        } else {
          htmlElement.setAttribute('data-bs-theme', 'light');
        }
      } catch (error) {
        console.log("Could not load display settings");
      }
    };
    applySettings();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Employee Routes */}
          <Route path="/employee" element={<PortalLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Manager Routes */}
          <Route path="/manager" element={<PortalLayout />}>
             <Route index element={<ManagerDashboard />} />
             <Route path="team" element={<Team />} />
             <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<PortalLayout />}>
             <Route index element={<AdminDashboard />} />
             <Route path="users" element={<UserManagement />} />
             <Route path="payroll" element={<PayrollAdmin />} />
             <Route path="settings" element={<Settings />} />
             <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;