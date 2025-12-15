import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (user.role === 'manager') {
    return <Navigate to="/manager" replace />;
  } else {
    return <Navigate to="/employee" replace />;
  }
};

export default RootRedirect;