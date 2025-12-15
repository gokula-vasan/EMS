import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './auth/AuthContext'; 

// Layouts
import PortalLayout from './layouts/PortalLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import Attendance from './pages/employee/Attendance';
import Leaves from './pages/employee/Leaves';
import Payroll from './pages/employee/Payroll'; // 👈 Employee View

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import Team from './pages/manager/Team';
import Approvals from './pages/manager/Approvals';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Settings from './pages/admin/Settings';
import PayrollAdmin from './pages/admin/PayrollAdmin'; // 👈 NEW: Admin Creation View

function App() {
  return (
    <BrowserRouter>
      {/* 🟢 AuthProvider wraps the entire app so Context works everywhere */}
      <AuthProvider>
        
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* 🟢 Employee Portal */}
          <Route path="/employee" element={<PortalLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="payroll" element={<Payroll />} /> {/* Employee sees history here */}
          </Route>

          {/* 🔵 Manager Portal */}
          <Route path="/manager" element={<PortalLayout />}>
             <Route index element={<ManagerDashboard />} />
             <Route path="team" element={<Team />} />
             <Route path="approvals" element={<Approvals />} />
          </Route>

          {/* 🔴 Admin Portal */}
          <Route path="/admin" element={<PortalLayout />}>
             <Route index element={<AdminDashboard />} />
             <Route path="users" element={<UserManagement />} />
             <Route path="settings" element={<Settings />} />
             <Route path="payroll" element={<PayrollAdmin />} /> {/* 👈 Admin creates payroll here */}
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;