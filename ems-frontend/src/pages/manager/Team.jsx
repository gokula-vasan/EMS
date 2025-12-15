import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader, ExternalLink } from 'lucide-react'; // Added ExternalLink icon
import API from '../../utils/axiosHelper';
import toast from 'react-hot-toast';

const Team = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await API.get('/manager/employees');
        setEmployees(data);
      } catch (error) {
        toast.error('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h3 className="fw-bold text-dark">My Squad</h3>
           <p className="text-muted">Overview of your reporting team.</p>
        </div>
      </div>

      <div className="row g-4">
        {loading ? (
             <div className="col-12 text-center p-5 text-muted">
                <Loader className="animate-spin mb-2" /> Loading team...
             </div>
        ) : employees.length === 0 ? (
            <div className="col-12 text-center p-5 text-muted">
               <p>No employees found in your team.</p>
            </div>
        ) : (
            employees.map((emp) => (
              <div key={emp._id} className="col-md-6 col-xl-4">
                 <div className="card border-0 shadow-sm p-4 text-center position-relative h-100">
                    {/* Initials Avatar */}
                    <div className="mx-auto mb-3 p-1 rounded-circle border border-2 border-primary border-opacity-25 bg-light d-flex align-items-center justify-content-center" style={{width: 80, height: 80}}>
                       <span className="fs-1 fw-bold text-primary">{emp.name.charAt(0).toUpperCase()}</span>
                    </div>
                    
                    <h5 className="fw-bold text-dark mb-1">{emp.name}</h5>
                    <p className="text-muted small mb-3">{emp.department || 'General Team'}</p>
                    
                    <div className="d-flex justify-content-center gap-2 mb-4">
                       <span className="badge bg-light text-dark border">Employee</span>
                       <span className="badge bg-success-subtle text-success">Active</span>
                    </div>

                    <div className="d-flex gap-2 mt-auto">
                       {/* 👇 FIXED: Force open Gmail Compose Window */}
                       <a 
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${emp.email}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                       >
                          <Mail size={16}/> Email via Gmail
                       </a>
                    </div>
                 </div>
              </div>
            ))
        )}
      </div>
    </motion.div>
  );
};

export default Team;