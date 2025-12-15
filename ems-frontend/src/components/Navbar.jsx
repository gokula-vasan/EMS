import { useAuth } from '../auth/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, Clock, DollarSign } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'text-primary fw-bold' : 'text-muted';

  return (
    <nav className="navbar navbar-expand-lg navbar-glass px-4 py-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <div className="bg-primary text-white p-1 rounded">EMS</div>
          <span className="text-primary">Nexus</span>
        </Link>

        {user && (
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-4 align-items-center">
              <li className="nav-item">
                <Link className={`nav-link d-flex gap-2 align-items-center ${isActive('/')}`} to="/">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link d-flex gap-2 align-items-center ${isActive('/employees')}`} to="/employees">
                  <Users size={18} /> Employees
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link d-flex gap-2 align-items-center ${isActive('/attendance')}`} to="/attendance">
                  <Clock size={18} /> Attendance
                </Link>
              </li>
               <li className="nav-item">
                <Link className={`nav-link d-flex gap-2 align-items-center ${isActive('/payroll')}`} to="/payroll">
                  <DollarSign size={18} /> Payroll
                </Link>
              </li>
              
              <li className="nav-item border-start ps-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="text-end lh-1">
                    <div className="fw-bold fs-6">{user.name}</div>
                    <small className="text-muted" style={{fontSize: '0.75rem'}}>{user.role}</small>
                  </div>
                  <button onClick={handleLogout} className="btn btn-light text-danger bg-danger-subtle btn-sm p-2 rounded-circle">
                    <LogOut size={18} />
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;