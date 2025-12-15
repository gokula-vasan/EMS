import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, User, Calendar, Save, Calculator, CheckCircle, TrendingUp, Edit2, RefreshCw } from 'lucide-react';
import API from '../../utils/axiosHelper';
import toast from 'react-hot-toast';

const PayrollAdmin = () => {
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]); // Store list of issued payrolls
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // Track if we are editing
  
  const [formData, setFormData] = useState({
    userId: '',
    month: 'December 2025', 
    basicSalary: '',
    allowances: '',
    deductions: '',
    increment: ''
  });

  const netPay = (Number(formData.basicSalary) || 0) + (Number(formData.allowances) || 0) - (Number(formData.deductions) || 0);

  // Fetch Data
  const fetchData = async () => {
    try {
      const [usersRes, historyRes] = await Promise.all([
         API.get('/admin/users'),
         API.get('/payroll/all')
      ]);
      setUsers(usersRes.data.filter(u => u.role === 'employee'));
      setHistory(historyRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Handle Edit Click
  const handleEdit = (record) => {
    setEditingId(record._id);
    setFormData({
        userId: record.userId._id, // Lock user
        month: record.month,
        basicSalary: record.basicSalary,
        allowances: record.allowances,
        deductions: record.deductions,
        increment: record.increment || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to form
  };

  // Handle Cancel Edit
  const handleCancel = () => {
    setEditingId(null);
    setFormData({ userId: '', month: 'December 2025', basicSalary: '', allowances: '', deductions: '', increment: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE MODE
        await API.put(`/payroll/${editingId}`, formData);
        toast.success('Payslip updated successfully!');
      } else {
        // CREATE MODE
        await API.post('/payroll/create', formData);
        toast.success(`Payroll generated for ${formData.month}!`);
      }
      
      handleCancel(); // Reset form
      fetchData(); // Refresh table
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h3 className="fw-bold text-dark mb-1">Payroll Management</h3>
           <p className="text-muted mb-0">Issue and update employee salaries.</p>
        </div>
      </div>

      <div className="row g-4 mb-5">
        {/* Form Section */}
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm p-4 ${editingId ? 'border-primary border-2' : ''}`}>
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <div className={`p-2 rounded ${editingId ? 'bg-warning text-dark' : 'bg-primary bg-opacity-10 text-primary'}`}>
                {editingId ? <Edit2 size={20} /> : <Calculator size={20} />}
              </div>
              {editingId ? 'Update Existing Payslip' : 'Generate New Payslip'}
            </h5>

            <form onSubmit={handleSubmit}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Employee</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><User size={18} className="text-muted"/></span>
                    <select 
                      className="form-select border-start-0 ps-0 bg-light"
                      value={formData.userId}
                      onChange={(e) => setFormData({...formData, userId: e.target.value})}
                      required
                      disabled={!!editingId} // Disable user selection during edit
                    >
                      <option value="">-- Choose Employee --</option>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Pay Period</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Calendar size={18} className="text-muted"/></span>
                    <select 
                      className="form-select border-start-0 ps-0 bg-light"
                      value={formData.month}
                      onChange={(e) => setFormData({...formData, month: e.target.value})}
                    >
                      <option>December 2025</option>
                      <option>January 2026</option>
                      <option>February 2026</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Basic Salary (₹)</label>
                  <div className="input-group">
                    <span className="input-group-text"><IndianRupee size={16}/></span>
                    <input 
                      type="number" className="form-control" placeholder="0.00"
                      value={formData.basicSalary}
                      onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Increment / Bonus (%)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-success-subtle text-success"><TrendingUp size={16}/></span>
                    <input 
                      type="number" className="form-control" placeholder="0"
                      value={formData.increment}
                      onChange={(e) => setFormData({...formData, increment: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Allowances (₹)</label>
                  <div className="input-group">
                    <span className="input-group-text"><IndianRupee size={16}/></span>
                    <input 
                      type="number" className="form-control" placeholder="0.00"
                      value={formData.allowances}
                      onChange={(e) => setFormData({...formData, allowances: e.target.value})}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Deductions (₹)</label>
                  <div className="input-group">
                    <span className="input-group-text text-danger"><IndianRupee size={16}/></span>
                    <input 
                      type="number" className="form-control text-danger" placeholder="0.00"
                      value={formData.deductions}
                      onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                {editingId && (
                    <button type="button" onClick={handleCancel} className="btn btn-light">Cancel</button>
                )}
                <button type="submit" className={`btn ${editingId ? 'btn-warning text-dark' : 'btn-primary'} px-5 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm`}>
                  <Save size={18} /> {editingId ? 'Update Payslip' : 'Issue Payslip'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Preview */}
        <div className="col-lg-4">
           <div className="card bg-dark text-white border-0 shadow-lg" style={{background: 'linear-gradient(145deg, #1e293b, #0f172a)'}}>
              <div className="card-body p-4">
                 <h6 className="text-white-50 text-uppercase fw-bold mb-4 small">
                    {editingId ? 'Update Preview' : 'Payslip Preview'}
                 </h6>
                 <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">Basic Salary</span>
                    <span className="fw-medium">₹ {Number(formData.basicSalary).toLocaleString('en-IN')}</span>
                 </div>
                 <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">Allowances</span>
                    <span className="text-success fw-medium">+ ₹ {Number(formData.allowances).toLocaleString('en-IN')}</span>
                 </div>
                 <div className="d-flex justify-content-between mb-4">
                    <span className="text-white-50">Deductions</span>
                    <span className="text-danger fw-medium">- ₹ {Number(formData.deductions).toLocaleString('en-IN')}</span>
                 </div>
                 <div className="border-top border-white border-opacity-10 pt-3 mt-2">
                    <div className="d-flex justify-content-between align-items-end">
                       <div>
                          <small className="text-white-50 d-block mb-1">Total Net Pay</small>
                          <h2 className="mb-0 fw-bold">₹ {netPay.toLocaleString('en-IN')}</h2>
                       </div>
                       <CheckCircle className="text-success opacity-50" size={32} />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card border-0 shadow-sm">
         <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0">Recent Payroll History</h6>
            <button onClick={fetchData} className="btn btn-sm btn-light rounded-circle"><RefreshCw size={14}/></button>
         </div>
         <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
               <thead className="bg-light">
                  <tr>
                     <th className="ps-4 text-muted small fw-bold">Employee</th>
                     <th className="text-muted small fw-bold">Month</th>
                     <th className="text-muted small fw-bold">Basic</th>
                     <th className="text-muted small fw-bold">Net Pay</th>
                     <th className="text-end pe-4 text-muted small fw-bold">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {history.map(item => (
                     <tr key={item._id}>
                        <td className="ps-4 fw-bold">{item.userId?.name || 'Unknown'}</td>
                        <td>{item.month}</td>
                        <td className="text-muted">₹{item.basicSalary.toLocaleString('en-IN')}</td>
                        <td className="text-success fw-bold">₹{item.netPay.toLocaleString('en-IN')}</td>
                        <td className="text-end pe-4">
                           <button onClick={() => handleEdit(item)} className="btn btn-sm btn-outline-primary border-0">
                              <Edit2 size={16}/> Edit
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </motion.div>
  );
};

export default PayrollAdmin;