import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import API from '../../utils/axiosHelper';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Real Attendance History from Backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get('/attendance/history');
        setHistory(data);
      } catch (error) {
        console.error("Failed to load attendance", error);
        toast.error('Could not load attendance history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // 2. Helper: Calculate Work Hours Duration
  const calculateDuration = (start, end) => {
    if (!start || !end) return '-';
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    
    // Convert to Hours and Minutes
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.round(((diffMs % 3600000) / 60000));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  // 3. Helper: Format Time (e.g., 09:00 AM)
  const formatTime = (isoString) => {
    if (!isoString) return '-- : --';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="container-fluid p-0"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h3 className="fw-bold text-dark mb-1">My Attendance</h3>
           <p className="text-muted mb-0">Track your daily work hours and status.</p>
        </div>
        <button className="btn btn-outline-primary d-flex align-items-center gap-2">
           <Calendar size={18} />
           <span>Filter Month</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
           <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                 <thead className="bg-light">
                    <tr>
                       <th className="py-3 ps-4 border-0 text-muted small text-uppercase fw-semibold">Date</th>
                       <th className="py-3 border-0 text-muted small text-uppercase fw-semibold">Check In</th>
                       <th className="py-3 border-0 text-muted small text-uppercase fw-semibold">Check Out</th>
                       <th className="py-3 border-0 text-muted small text-uppercase fw-semibold">Work Hours</th>
                       <th className="py-3 pe-4 border-0 text-end text-muted small text-uppercase fw-semibold">Status</th>
                    </tr>
                 </thead>
                 <tbody>
                    {loading ? (
                       <tr><td colSpan="5" className="text-center py-5">Loading records...</td></tr>
                    ) : history.length === 0 ? (
                       <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                             <AlertCircle className="mb-2 opacity-25" size={32} />
                             <p className="mb-0">No attendance records found.</p>
                          </td>
                       </tr>
                    ) : (
                       history.map((record) => (
                          <tr key={record._id}>
                             <td className="ps-4 fw-medium text-dark">
                                {new Date(record.date).toLocaleDateString()}
                             </td>
                             <td className="text-muted">
                                {record.clockIn ? (
                                   <div className="d-flex align-items-center gap-2">
                                      <Clock size={14} className="text-primary"/> 
                                      {formatTime(record.clockIn)}
                                   </div>
                                ) : '-'}
                             </td>
                             <td className="text-muted">
                                {formatTime(record.clockOut)}
                             </td>
                             <td className="fw-semibold text-dark">
                                {calculateDuration(record.clockIn, record.clockOut)}
                             </td>
                             <td className="pe-4 text-end">
                                <span className={`badge rounded-pill px-3 py-2 ${
                                   record.status === 'Present' ? 'bg-success-subtle text-success' : 
                                   record.status === 'Late' ? 'bg-warning-subtle text-warning-emphasis' : 
                                   'bg-danger-subtle text-danger'
                                }`}>
                                   {record.status}
                                </span>
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Attendance;