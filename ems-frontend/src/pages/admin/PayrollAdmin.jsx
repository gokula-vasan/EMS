import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, User, Calendar, Save, Calculator, CheckCircle, TrendingUp } from 'lucide-react';
import API from '../../utils/axiosHelper';
import toast from 'react-hot-toast';

const PayrollAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    userId: '',
    month: 'December 2025', 
    basicSalary: '',
    allowances: '',
    deductions: '',
    increment: ''
  });

  const netPay = (Number(formData.basicSalary) || 0) + (Number(formData.allowances) || 0) - (Number(formData.deductions) || 0);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await API.get('/admin/users');
        // Filter only employees
        const employees = data.filter(u => u.role === 'employee');
        setUsers(employees);
      } catch (error) {
        toast.error('Failed to load employee list');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.basicSalary) {
      return toast.error('Please select an employee and enter basic salary');
    }

    try {
      console.log("Sending Payroll Data:", formData); // 👈 Debug log to check ID
      await API.post('/payroll/create', formData);
      toast.success(`Payroll generated for ${formData.month}!`);
      setFormData({ ...formData, basicSalary: '', allowances: '', deductions: '', increment: '' });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to generate payroll');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h3 className="fw-bold text-dark mb-1">Payroll Management</h3>
           <p className="text-muted mb-0">Issue monthly salaries to employees.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Creation Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <div className="bg-primary bg-opacity-10 p-2 rounded text-primary">
                <Calculator size={20} />
              </div>
              Generate New Payslip
            </h5>

            <form onSubmit={handleSubmit}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Select Employee</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><User size={18} className="text-muted"/></span>
                    <select 
                      className="form-select border-start-0 ps-0 bg-light"
                      value={formData.userId}
                      onChange={(e) => setFormData({...formData, userId: e.target.value})}
                      required
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
                      type="number" 
                      className="form-control" 
                      placeholder="0.00"
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
                      type="number" 
                      className="form-control" 
                      placeholder="0"
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
                      type="number" 
                      className="form-control" 
                      placeholder="0.00"
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
                      type="number" 
                      className="form-control text-danger" 
                      placeholder="0.00"
                      value={formData.deductions}
                      onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary px-5 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm">
                  <Save size={18} /> Issue Payslip
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Preview */}
        <div className="col-lg-4">
           <div className="card bg-dark text-white border-0 shadow-lg" style={{background: 'linear-gradient(145deg, #1e293b, #0f172a)'}}>
              <div className="card-body p-4">
                 <h6 className="text-white-50 text-uppercase fw-bold mb-4 small">Payslip Preview</h6>
                 
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

                 {formData.increment && (
                    <div className="alert alert-success bg-success bg-opacity-25 border-0 text-success d-flex align-items-center gap-2 py-2 mb-4">
                        <TrendingUp size={16} />
                        <small className="fw-bold">Includes {formData.increment}% Increment</small>
                    </div>
                 )}

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
    </motion.div>
  );
};

export default PayrollAdmin;