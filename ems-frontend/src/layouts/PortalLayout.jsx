import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  DollarSign, 
  Calendar, 
  Clock, 
  Briefcase,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const PortalLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Define Menus for each Role
  const menus = {
    admin: [
      { label: 'Overview', path: '/admin', icon: LayoutDashboard },
      { label: 'User Mgmt', path: '/admin/users', icon: Users },
      { label: 'Payroll', path: '/admin/payroll', icon: DollarSign }, // 👈 ADDED MISSING LINK
      { label: 'System Config', path: '/admin/settings', icon: Settings },
      { label: 'My Profile', path: '/admin/profile', icon: UserCircle },
    ],
    manager: [
      { label: 'Overview', path: '/manager', icon: LayoutDashboard },
      { label: 'My Squad', path: '/manager/team', icon: Users },
      { label: 'My Profile', path: '/manager/profile', icon: UserCircle },
    ],
    employee: [
      { label: 'Dashboard', path: '/employee', icon: LayoutDashboard },
      { label: 'Attendance', path: '/employee/attendance', icon: Clock },
      { label: 'Leaves', path: '/employee/leaves', icon: Calendar },
      { label: 'Payroll', path: '/employee/payroll', icon: DollarSign },
      { label: 'My Profile', path: '/employee/profile', icon: UserCircle },
    ]
  };

  // Get current menu based on role (default to employee if undefined)
  const currentMenu = user ? menus[user.role] || [] : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ width: isSidebarOpen ? 250 : 70 }}
        animate={{ width: isSidebarOpen ? 250 : 70 }}
        className="bg-dark text-white shadow h-100 d-flex flex-column position-relative z-3"
      >
        {/* Brand Logo */}
        <div className="d-flex align-items-center gap-3 p-3 border-bottom border-secondary">
           <div className="bg-primary rounded p-1">
              <span className="fw-bold fs-4">E</span>
           </div>
           {isSidebarOpen && <span className="fw-bold fs-5">EMS.io</span>}
        </div>

        {/* Navigation Links */}
        <div className="flex-grow-1 py-4 d-flex flex-column gap-2 px-2 overflow-auto">
          {currentMenu.map((item) => {
             const isActive = location.pathname === item.path;
             return (
               <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`text-decoration-none d-flex align-items-center gap-3 p-3 rounded transition-all ${isActive ? 'bg-primary text-white shadow-sm' : 'text-white-50 hover-bg-dark-light'}`}
               >
                  <item.icon size={20} />
                  {isSidebarOpen && <span className="fw-medium">{item.label}</span>}
               </Link>
             );
          })}
        </div>

        {/* Logout Button */}
        <div className="p-3 border-top border-secondary">
          <button 
            onClick={handleLogout} 
            className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
          >
             <LogOut size={20} />
             {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>

        {/* User Info (Mini) */}
        {isSidebarOpen && user && (
           <div className="p-3 bg-black bg-opacity-25">
              <div className="d-flex align-items-center gap-3">
                 <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{width: 35, height: 35}}>
                    {user.name.charAt(0).toUpperCase()}
                 </div>
                 <div className="overflow-hidden">
                    <p className="mb-0 fw-bold small text-truncate">{user.name}</p>
                    <p className="mb-0 text-white-50 x-small text-uppercase" style={{fontSize: '0.7rem'}}>{user.role}</p>
                 </div>
              </div>
           </div>
        )}
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow-1 d-flex flex-column h-100 overflow-hidden">
        {/* Top Header / Toggle */}
        <header className="bg-white border-bottom p-3 d-flex align-items-center shadow-sm z-2">
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn btn-light rounded-circle shadow-sm">
              {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
           </button>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-grow-1 overflow-auto p-4 position-relative">
           <Outlet /> {/* This is where Dashboard, Payroll, etc. appear */}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;