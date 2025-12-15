import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/axiosHelper';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Briefcase } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin', department: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0 p-5" style={{width: '450px'}}>
        <h3 className="fw-bold text-center mb-4">Create Admin Account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
             <div className="input-group">
                <span className="input-group-text bg-white"><User size={18}/></span>
                <input type="text" className="form-control" placeholder="Full Name" required 
                   onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
          </div>
          <div className="mb-3">
             <div className="input-group">
                <span className="input-group-text bg-white"><Mail size={18}/></span>
                <input type="email" className="form-control" placeholder="Email" required 
                   onChange={e => setFormData({...formData, email: e.target.value})} />
             </div>
          </div>
          <div className="mb-3">
             <div className="input-group">
                <span className="input-group-text bg-white"><Lock size={18}/></span>
                <input type="password" className="form-control" placeholder="Password" required 
                   onChange={e => setFormData({...formData, password: e.target.value})} />
             </div>
          </div>
          {/* Hidden Role Select - Defaulting to Admin for setup */}
          <div className="mb-4">
             <div className="input-group">
                <span className="input-group-text bg-white"><Briefcase size={18}/></span>
                <input type="text" className="form-control" placeholder="Department (e.g. IT)" 
                   onChange={e => setFormData({...formData, department: e.target.value})} />
             </div>
          </div>
          <button className="btn btn-primary w-100 mb-3">Register Admin</button>
          <div className="text-center">
             <Link to="/login">Already have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;