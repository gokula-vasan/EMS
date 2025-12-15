import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Calendar, Clock, Filter } from 'lucide-react';
import API from '../../utils/axiosHelper';
import toast from 'react-hot-toast';

const Approvals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Pending Requests
  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/leaves/pending');
      setRequests(data);
    } catch (error) {
      toast.error('Failed to load approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. Handle Decision
  const handleAction = async (id, status) => {
    try {
      await API.put(`/leaves/${id}`, { status });
      toast.success(`Request ${status}`);
      // Remove the item from UI immediately
      setRequests((prev) => prev.filter(req => req._id !== id));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
       <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Approvals Inbox</h3>
          <p className="text-muted mb-0">Review pending leave requests.</p>
        </div>
      </div>

      <div className="row g-4">
         {loading ? (
             <div className="col-12 text-center py-5"><div className="spinner-border text-primary"></div></div>
         ) : requests.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
               <div className="mb-3 bg-light rounded-circle p-4 d-inline-block">
                 <Check className="text-muted" size={32}/>
               </div>
               <h4>All caught up!</h4>
               <p>No pending approvals found.</p>
            </div>
         ) : (
            <AnimatePresence>
              {requests.map((req) => (
                <div key={req._id} className="col-lg-6">
                   <motion.div 
                     layout
                     exit={{ opacity: 0, scale: 0.9 }}
                     className="card border-0 shadow-sm p-4 h-100"
                   >
                      <div className="d-flex justify-content-between align-items-start mb-3">
                         <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{width: 48, height: 48}}>
                               {req.userId?.name.charAt(0)}
                            </div>
                            <div>
                               <h6 className="fw-bold mb-0 text-dark">{req.userId?.name}</h6>
                               <span className="badge bg-light text-primary border mt-1">{req.leaveType}</span>
                            </div>
                         </div>
                         <div className="text-end">
                            <small className="text-muted d-block mb-1">Applied</small>
                            <span className="fw-medium small text-dark">
                               {new Date(req.appliedOn).toLocaleDateString()}
                            </span>
                         </div>
                      </div>

                      <div className="bg-light p-3 rounded mb-4">
                         <div className="d-flex align-items-center gap-2 text-dark fw-medium mb-2">
                            <Calendar size={16} className="text-muted"/> 
                            {new Date(req.startDate).toLocaleDateString()} — {new Date(req.endDate).toLocaleDateString()}
                         </div>
                         <p className="text-muted small mb-0 fst-italic">"{req.reason}"</p>
                      </div>

                      <div className="d-flex gap-2 mt-auto">
                         <button 
                            onClick={() => handleAction(req._id, 'Rejected')}
                            className="btn btn-outline-danger flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2"
                          >
                            <X size={18}/> Reject
                         </button>
                         <button 
                            onClick={() => handleAction(req._id, 'Approved')}
                            className="btn btn-success flex-grow-1 py-2 text-white d-flex align-items-center justify-content-center gap-2"
                          >
                            <Check size={18}/> Approve
                         </button>
                      </div>
                   </motion.div>
                </div>
              ))}
            </AnimatePresence>
         )}
      </div>
    </motion.div>
  );
};

export default Approvals;