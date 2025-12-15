import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, Camera, Mail, Shield, Briefcase, Key } from 'lucide-react';
import API from '../utils/axiosHelper';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext'; // Ensure you have this context

const Profile = () => {
  const { user, login } = useAuth(); // We use login() to update the local user state after save
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '', // Email is usually read-only for security
    role: '',
    department: '',
    password: '',
    confirmPassword: ''
  });

  // 1. Load User Data on Mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        department: user.department || 'General',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  // 2. Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit Updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setLoading(false);
      return toast.error("Passwords don't match!");
    }

    try {
      const updatePayload = { name: formData.name };
      if (formData.password) updatePayload.password = formData.password;

      // Call the API endpoint we created in authController
      const { data } = await API.put('/auth/profile', updatePayload);
      
      // Update local storage/context with new info
      login(data); 
      
      toast.success("Profile updated successfully!");
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' })); // Clear password fields
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">My Profile</h3>
        <p className="text-muted">Manage your personal information and security.</p>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN: Profile Card */}
        <div className="col-lg-4">
           <div className="card border-0 shadow-sm p-4 text-center h-100 position-relative overflow-hidden">
              <div className="absolute-top-bg bg-primary opacity-10" style={{height: '100px', position: 'absolute', top: 0, left: 0, width: '100%'}}></div>
              
              <div className="mx-auto mb-3 position-relative mt-4">
                 <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center fw-bold display-4 border border-4 border-white shadow" style={{width: 120, height: 120, zIndex: 2, position: 'relative'}}>
                    {user?.name?.charAt(0).toUpperCase()}
                 </div>
              </div>
              
              <h4 className="fw-bold mb-1">{user?.name}</h4>
              <p className="text-muted small mb-3 text-uppercase badge bg-light text-dark border px-3 py-2 mt-2">
                {user?.role}
              </p>

              <div className="text-start mt-4 pt-3 border-top">
                 <div className="d-flex align-items-center gap-3 mb-3 text-muted">
                    <Mail size={18} className="text-primary"/> {user?.email}
                 </div>
                 <div className="d-flex align-items-center gap-3 mb-3 text-muted">
                    <Shield size={18} className="text-primary"/> Access Level: <span className="text-capitalize">{user?.role}</span>
                 </div>
                 
                 {/* Only show Department if NOT Admin */}
                 {user?.role !== 'admin' && (
                   <div className="d-flex align-items-center gap-3 text-muted">
                      <Briefcase size={18} className="text-primary"/> Department: {user?.department || 'General'}
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: Edit Form */}
        <div className="col-lg-8">
           <div className="card border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 border-bottom pb-3">
                 <User size={20} className="text-primary"/> Edit Details
              </h5>
              
              <form onSubmit={handleSubmit}>
                 <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">Full Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">Email Address</label>
                        <input 
                            type="email" 
                            className="form-control bg-light" 
                            value={formData.email} 
                            disabled 
                            title="Email cannot be changed"
                        />
                        <small className="text-muted" style={{fontSize: '0.75rem'}}>Contact Admin to change email.</small>
                    </div>
                 </div>

                 <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 border-bottom pb-3 mt-5">
                    <Key size={20} className="text-danger"/> Security Settings
                 </h5>

                 <div className="alert alert-light border-0 d-flex gap-3 align-items-center mb-4">
                    <Lock className="text-muted" size={18}/>
                    <small className="text-muted">Leave these fields <b>blank</b> if you do not want to change your password.</small>
                 </div>

                 <div className="row g-3 mb-4">
                    <div className="col-md-6">
                       <label className="form-label small fw-bold text-muted">New Password</label>
                       <input 
                          type="password" 
                          className="form-control" 
                          name="password" 
                          placeholder="********" 
                          value={formData.password} 
                          onChange={handleChange} 
                       />
                    </div>
                    <div className="col-md-6">
                       <label className="form-label small fw-bold text-muted">Confirm Password</label>
                       <input 
                          type="password" 
                          className="form-control" 
                          name="confirmPassword" 
                          placeholder="********" 
                          value={formData.confirmPassword} 
                          onChange={handleChange} 
                       />
                    </div>
                 </div>

                 <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light text-muted" onClick={() => setFormData({...formData, name: user.name, password: '', confirmPassword: ''})}>Cancel</button>
                    <button type="submit" className="btn btn-primary px-4 py-2 fw-bold d-flex align-items-center gap-2" disabled={loading}>
                       <Save size={18}/> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;