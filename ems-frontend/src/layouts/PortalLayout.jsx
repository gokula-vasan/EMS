import { useState } from 'react';
import { Outlet, useLocation, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Clock, FileText, Settings, 
  LogOut, Menu, Bell, Search, DollarSign 
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext'; 
import '../styles/globals.css';

const PortalLayout = () => {
  const { user, logout } = useAuth(); // 👈 Get the logout function here
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // If not logged in, force redirect to Login
  if (!user) return <Navigate to="/login" />;

  const menus = {
    admin: [
      { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
      { icon: Users, label: 'User Mgmt', path: '/admin/users' },
      { icon: Settings, label: 'System Config', path: '/admin/settings' },
    ],
    manager: [
      { icon: LayoutDashboard, label: 'Team Pulse', path: '/manager' },
      { icon: Users, label: 'My Squad', path: '/manager/team' },
      { icon: FileText, label: 'Approvals', path: '/manager/approvals' },
    ],
    employee: [
      { icon: LayoutDashboard, label: 'My Hub', path: '/employee' },
      { icon: Clock, label: 'Attendance', path: '/employee/attendance' },
      { icon: FileText, label: 'Leaves', path: '/employee/leaves' },
      { icon: DollarSign, label: 'Payroll', path: '/employee/payroll' },
    ]
  };

  const currentMenu = menus[user.role] || menus.employee;

  // Colors based on Role
  const sidebarColor = 
    user.role === 'admin' ? '#0f172a' : 
    user.role === 'manager' ? '#312e81' : 
    '#ffffff'; 

  const textColor = user.role === 'employee' ? 'text-dark' : 'text-white';
  const mutedColor = user.role === 'employee' ? 'text-muted' : 'text-white-50';
  const hoverColor = user.role === 'employee' ? 'bg-light' : 'bg-white bg-opacity-10';

  return (
    <div className="d-flex overflow-hidden w-100 vh-100 bg-light">
      
      {/* 🟢 SIDEBAR */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="d-flex flex-column flex-shrink-0 shadow-lg position-relative z-3"
        style={{ backgroundColor: sidebarColor, transition: 'background-color 0.3s' }}
      >
        {/* 1. Brand Header */}
        <div className={`d-flex align-items-center justify-content-center py-4 border-bottom ${user.role === 'employee' ? 'border-secondary-subtle' : 'border-white border-opacity-10'}`} style={{height: '70px'}}>
           <div className="bg-primary rounded p-1 me-2 d-flex align-items-center justify-content-center" style={{width: 32, height: 32}}>
             <span className="fw-bold text-white small">E</span>
           </div>
           {isSidebarOpen && (
             <span className={`fw-bold fs-5 tracking-tight ${textColor}`}>
               EMS<span className="text-primary">.io</span>
             </span>
           )}
        </div>

        {/* 2. Navigation Menu */}
        <nav className="p-3 flex-grow-1 overflow-y-auto">
          <ul className="nav nav-pills flex-column mb-auto gap-2">
            {currentMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 transition-all
                      ${isActive ? 'bg-primary text-white shadow-sm' : `${textColor} ${hoverColor}`}
                      ${!isSidebarOpen ? 'justify-content-center' : ''}
                    `}
                    title={!isSidebarOpen ? item.label : ''}
                  >
                    <item.icon size={20} />
                    {isSidebarOpen && <span className="fw-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 3. LOGOUT BUTTON (New Section) */}
        <div className="p-3">
          <button 
            onClick={logout} 
            className={`btn w-100 d-flex align-items-center gap-3 px-3 py-2 rounded-3 transition-all border-0
              ${user.role === 'employee' ? 'btn-danger text-white' : 'bg-danger bg-opacity-75 text-white hover-bg-danger'}
              ${!isSidebarOpen ? 'justify-content-center' : ''}
            `}
            title="Sign Out"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="fw-medium">Sign Out</span>}
          </button>
        </div>

        {/* 4. User Footer */}
        <div className={`p-3 border-top mt-auto ${user.role === 'employee' ? 'border-secondary-subtle' : 'border-white border-opacity-10'}`}>
          <div className={`d-flex align-items-center ${!isSidebarOpen ? 'justify-content-center' : ''}`}>
            <div className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" 
                 style={{width: 40, height: 40, minWidth: 40, background: 'linear-gradient(45deg, #4f46e5, #818cf8)'}}>
              {user.name.charAt(0)}
            </div>
            
            {isSidebarOpen && (
              <div className="ms-3 lh-1 flex-grow-1 overflow-hidden">
                <div className={`fw-semibold small text-truncate ${textColor}`}>{user.name}</div>
                <small className={`${mutedColor}`} style={{fontSize: '0.75rem'}}>{user.role.toUpperCase()}</small>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* 🔵 MAIN CONTENT AREA */}
      <div className="d-flex flex-column flex-grow-1 h-100 position-relative">
        <header className="bg-white py-2 px-4 border-bottom d-flex align-items-center justify-content-between sticky-top shadow-sm z-2" style={{height: '70px'}}>
           <div className="d-flex align-items-center gap-3">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="btn btn-light border-0 text-secondary p-2 rounded-circle hover-bg-gray">
               <Menu size={20} />
             </button>
           </div>
           <div className="d-flex align-items-center gap-3">
              <button className="btn btn-light position-relative p-2 rounded-circle text-secondary">
                <Bell size={20} />
              </button>
           </div>
        </header>
        <main className="p-4 flex-grow-1 overflow-y-auto scroll-smooth">
          <AnimatePresence mode='wait'>
             <Outlet />
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;