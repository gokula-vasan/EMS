import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2, Edit, X } from 'lucide-react';
import API from '../../utils/axiosHelper';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '', email: '', password: '', role: 'employee', department: ''
  });

  // 1. Fetch Users
  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/users', newUser);
      toast.success('User created successfully!');
      setShowModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'employee', department: '' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  // 3. Delete User
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0 position-relative">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
         <div>
            <h3 className="fw-bold text-dark">User Directory</h3>
            <p className="text-muted mb-0">Manage system access and roles.</p>
         </div>
         <button onClick={() => setShowModal(true)} className="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
            <Plus size={18}/> Add New User
         </button>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
         <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
               <thead className="bg-light">
                  <tr>
                     <th className="ps-4 py-3 border-0 text-muted small fw-bold">Name</th>
                     <th className="py-3 border-0 text-muted small fw-bold">Role</th>
                     <th className="py-3 border-0 text-muted small fw-bold">Department</th>
                     <th className="pe-4 py-3 border-0 text-end text-muted small fw-bold">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-4">Loading users...</td></tr>
                  ) : users.map(user => (
                     <tr key={user._id}>
                        <td className="ps-4 py-3">
                           <div className="d-flex align-items-center gap-3">
                              <div className="rounded-circle bg-indigo-subtle text-indigo d-flex align-items-center justify-content-center fw-bold text-white bg-primary" style={{width: 36, height: 36}}>
                                 {user.name.charAt(0)}
                              </div>
                              <div>
                                 <h6 className="mb-0 fw-medium text-dark">{user.name}</h6>
                                 <small className="text-muted">{user.email}</small>
                              </div>
                           </div>
                        </td>
                        <td>
                           <span className={`badge border ${
                              user.role === 'admin' ? 'bg-dark text-white' : 
                              user.role === 'manager' ? 'bg-primary-subtle text-primary' : 'bg-light text-dark'
                           }`}>
                              {user.role.toUpperCase()}
                           </span>
                        </td>
                        <td className="text-muted">{user.department || 'General'}</td>
                        <td className="pe-4 text-end">
                           <button onClick={() => handleDelete(user._id)} className="btn btn-sm btn-light text-danger hover-danger">
                             <Trash2 size={16}/>
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* ADD USER MODAL OVERLAY */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" style={{zIndex: 1050}}>
           <motion.div initial={{scale: 0.9}} animate={{scale: 1}} className="card border-0 shadow-lg p-4" style={{width: '500px'}}>
              <div className="d-flex justify-content-between mb-4">
                 <h5 className="fw-bold">Onboard New User</h5>
                 <button onClick={() => setShowModal(false)} className="btn btn-light btn-sm rounded-circle"><X size={18}/></button>
              </div>
              
              <form onSubmit={handleAddUser}>
                 <div className="mb-3">
                    <label className="form-label small fw-bold">Full Name</label>
                    <input type="text" className="form-control" required 
                      value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                 </div>
                 <div className="mb-3">
                    <label className="form-label small fw-bold">Email</label>
                    <input type="email" className="form-control" required 
                      value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                 </div>
                 <div className="mb-3">
                    <label className="form-label small fw-bold">Password</label>
                    <input type="password" className="form-control" required 
                      value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                 </div>
                 <div className="row mb-4">
                    <div className="col-6">
                       <label className="form-label small fw-bold">Role</label>
                       <select className="form-select" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                          <option value="employee">Employee</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                       </select>
                    </div>
                    <div className="col-6">
                       <label className="form-label small fw-bold">Department</label>
                       <input type="text" className="form-control" placeholder="e.g. IT"
                        value={newUser.department} onChange={e => setNewUser({...newUser, department: e.target.value})} />
                    </div>
                 </div>
                 <button type="submit" className="btn btn-primary w-100 py-2">Create Account</button>
              </form>
           </motion.div>
        </div>
      )}

    </motion.div>
  );
};

export default UserManagement;