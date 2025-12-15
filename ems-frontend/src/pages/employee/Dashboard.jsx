import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, CheckCircle, Coffee, AlertCircle } from 'lucide-react';
import API from '../../utils/axiosHelper'; // Import our API helper
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState({
    clockedIn: false,
    clockInTime: null,
    clockOutTime: null
  });
  const [loading, setLoading] = useState(true);

  // 1. Fetch Current Status on Mount
  const fetchStatus = async () => {
    try {
      const { data } = await API.get('/attendance/status');
      setAttendance(data);
    } catch (error) {
      console.error("Failed to fetch status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // 2. Handle Clock Actions
  const handleClockIn = async () => {
    try {
      const { data } = await API.post('/attendance/clock-in');
      setAttendance({ ...attendance, clockedIn: true, clockInTime: data.clockIn });
      toast.success("Clocked in successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clock in");
    }
  };

  const handleClockOut = async () => {
    try {
      const { data } = await API.put('/attendance/clock-out');
      setAttendance({ ...attendance, clockOutTime: data.clockOut });
      toast.success("Clocked out. Have a good evening!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clock out");
    }
  };

  // Helper to format time
  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      
      <div className="mb-5">
        <h2 className="fw-bold text-dark mb-1">Welcome, {user?.name.split(' ')[0]}! 👋</h2>
        <p className="text-muted">Here is your daily activity.</p>
      </div>

      <div className="row g-4">
        {/* CLOCK IN WIDGET */}
        <div className="col-lg-8">
           <div className="card h-100 bg-white border-0 shadow-sm overflow-hidden position-relative">
             <div className="card-body p-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
                <div>
                   <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                     <Clock className="text-primary" /> Today's Shift
                   </h4>
                   
                   {/* Logic for Displaying Status */}
                   {loading ? (
                     <div className="spinner-border text-primary" role="status"></div>
                   ) : (
                     <>
                       {attendance.clockedIn ? (
                         <div>
                            <h1 className="display-4 fw-bold text-dark mb-0">{formatTime(attendance.clockInTime)}</h1>
                            <p className="text-success fw-bold mb-0">You are Clocked In</p>
                            {attendance.clockOutTime && <small className="text-muted">Clocked Out at: {formatTime(attendance.clockOutTime)}</small>}
                         </div>
                       ) : (
                         <div>
                            <h1 className="display-4 fw-bold text-muted mb-0">--:--</h1>
                            <p className="text-muted">Not started yet</p>
                         </div>
                       )}
                     </>
                   )}

                   <div className="d-flex gap-3 mt-4">
                      {/* Disable Clock In if already clocked in */}
                      <button 
                        onClick={handleClockIn}
                        disabled={loading || attendance.clockedIn}
                        className={`btn btn-lg px-5 py-3 shadow-lg ${attendance.clockedIn ? 'btn-secondary' : 'btn-primary'}`}
                      >
                        Clock In
                      </button>

                      {/* Disable Clock Out if NOT clocked in OR ALREADY clocked out */}
                      <button 
                        onClick={handleClockOut}
                        disabled={loading || !attendance.clockedIn || attendance.clockOutTime}
                        className="btn btn-light btn-lg px-4 py-3 text-danger border"
                      >
                        Clock Out
                      </button>
                   </div>
                </div>
                
                {/* Visual Graphic */}
                <div className="d-none d-md-block opacity-75">
                   <div className="rounded-circle bg-primary bg-opacity-10 p-5 d-flex align-items-center justify-content-center" style={{width: 200, height: 200}}>
                      <Coffee size={64} className="text-primary" />
                   </div>
                </div>
             </div>
           </div>
        </div>

        {/* Stats Column */}
        <div className="col-lg-4">
           {/* Static Mock Stats for now - You can create APIs for these later */}
           <div className="card h-100 bg-primary text-white p-4 shadow-lg border-0" style={{background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)'}}>
              <div className="d-flex justify-content-between align-items-start mb-4">
                 <div>
                    <h6 className="text-white-50 text-uppercase mb-1 small fw-bold">Leave Balance</h6>
                    <h2 className="mb-0 fw-bold">12 Days</h2>
                 </div>
                 <Calendar size={24} className="text-white opacity-50" />
              </div>
              <button className="btn btn-sm btn-light text-primary fw-bold w-100">Apply Leave</button>
           </div>
        </div>
      </div>

    </motion.div>
  );
};

export default EmployeeDashboard;