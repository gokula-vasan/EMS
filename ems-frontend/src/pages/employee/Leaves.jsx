import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import API from '../../utils/axiosHelper';
import toast from 'react-hot-toast';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    leaveType: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // 1. Fetch Leave History on Load
  const fetchLeaves = async () => {
    try {
      const { data } = await API.get('/leaves/my-leaves');
      setLeaves(data);
    } catch (error) {
      toast.error('Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // 2. Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      return toast.error('Please fill in all fields');
    }

    try {
      await API.post('/leaves/apply', formData);
      toast.success('Leave request submitted!');
      setFormData({ leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' }); // Reset form
      fetchLeaves(); // Refresh list immediately
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  // Helper for status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return { color: 'success', icon: CheckCircle };
      case 'Rejected': return { color: 'danger', icon: XCircle };
      default: return { color: 'warning', icon: Clock };
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      <div className="row g-4">
        
        {/* LEFT: Apply Form */}
        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Plus className="text-primary p-1 bg-primary-subtle rounded" size={28} />
              Apply for Leave
            </h5>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Leave Type</label>
                <select 
                  className="form-select py-2"
                  value={formData.leaveType}
                  onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                >
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Annual Vacation</option>
                  <option>Remote Work</option>
                </select>
              </div>
              
              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">From Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">To Date</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Reason</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Briefly describe why..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-medium shadow-sm">
                Submit Request
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Real History List */}
        <div className="col-lg-8">
          <div className="card h-100 border-0 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Leave History</h5>
              <button className="btn btn-light btn-sm" onClick={fetchLeaves}>Refresh</button>
            </div>
            
            <div className="d-flex flex-column gap-3 overflow-y-auto" style={{maxHeight: '500px'}}>
              {loading ? (
                 <p className="text-muted text-center py-5">Loading records...</p>
              ) : leaves.length === 0 ? (
                 <p className="text-muted text-center py-5">No leave history found.</p>
              ) : (
                leaves.map((leave) => {
                  const badge = getStatusBadge(leave.status);
                  const Icon = badge.icon;
                  return (
                    <div key={leave._id} className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light-subtle hover-shadow transition-all">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`p-3 rounded-circle bg-${badge.color}-subtle text-${badge.color}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">{leave.leaveType}</h6>
                          <div className="d-flex align-items-center gap-2 text-muted small">
                             <Calendar size={14} /> 
                             {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </div>
                          <p className="mb-0 text-muted small fst-italic mt-1">"{leave.reason}"</p>
                        </div>
                      </div>
                      <span className={`badge bg-${badge.color}-subtle text-${badge.color} px-3 py-2 rounded-pill`}>
                        {leave.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Leaves;