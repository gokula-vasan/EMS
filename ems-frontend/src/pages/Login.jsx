import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth(); // Get user from context
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/employee');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          const userData = JSON.parse(localStorage.getItem('user'));
          
          // Navigate based on user role
          if (userData?.role === 'admin') {
            navigate('/admin');
          } else if (userData?.role === 'manager') {
            navigate('/manager');
          } else {
            navigate('/employee');
          }
        }, 100);
      }
      
    } catch (err) {
      // Error is handled by toast in AuthContext
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light overflow-hidden position-relative">
      <div className="container position-relative z-1 d-flex align-items-center justify-content-center">
        <div className="row w-100 justify-content-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-md-8 col-lg-5"
          >
            <div className="card border-0 shadow-lg overflow-hidden">
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="bg-primary text-white rounded-3 mb-3 d-inline-flex align-items-center justify-content-center" style={{width: 50, height: 50}}>
                    <span className="fw-bold fs-4">E</span>
                  </div>
                  <h3 className="fw-bold text-dark">EMS Nexus</h3>
                  <p className="text-muted">Enter your credentials to access.</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted"><Mail size={18}/></span>
                      <input 
                        type="email" 
                        className="form-control bg-light border-start-0 ps-0" 
                        placeholder="user@nexus.io"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted"><Lock size={18}/></span>
                      <input 
                        type="password" 
                        className="form-control bg-light border-start-0 ps-0" 
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-3 mb-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Authenticating...' : <>Sign In <ArrowRight size={18} /></>}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;