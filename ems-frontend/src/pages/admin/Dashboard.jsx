import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, ShieldCheck, Activity, Bell, Clock, Loader } from 'lucide-react';
import API from '../../utils/axiosHelper';

const AdminDashboard = () => {
  const [data, setData] = useState({
    stats: { totalEmployees: 0, totalPayroll: 0, adminsCount: 0 },
    alerts: [],
    logs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await API.get('/admin/dashboard');
        setData(data);
      } catch (error) {
        console.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  if (loading) return <div className="p-5 text-center text-muted"><Loader className="animate-spin mb-2"/> Loading live dashboard...</div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="container-fluid p-0">
      <div className="mb-4">
        <h3 className="fw-bold text-dark">System Overview</h3>
        <p className="text-muted">Live control panel for EMS Nexus.</p>
      </div>

      {/* 1. Top Stats Row */}
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Employees', val: data.stats.totalEmployees, icon: Users, color: 'primary' },
          { label: 'Total Payroll (YTD)', val: `₹ ${data.stats.totalPayroll.toLocaleString('en-IN')}`, icon: DollarSign, color: 'success' },
          { label: 'Pending Actions', val: data.alerts.length, icon: Bell, color: 'warning' },
          { label: 'Admins', val: data.stats.adminsCount, icon: ShieldCheck, color: 'info' }
        ].map((item, i) => (
          <div key={i} className="col-md-3">
            <motion.div whileHover={{ y: -5 }} className="card border-0 shadow-sm p-3 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                   <p className="text-muted text-uppercase fw-bold small mb-1">{item.label}</p>
                   <h3 className="fw-bold mb-0 text-dark">{item.val}</h3>
                </div>
                <div className={`p-3 rounded-circle bg-${item.color}-subtle text-${item.color}`}>
                   <item.icon size={24} />
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* 2. Real System Alerts */}
        <div className="col-lg-6">
           <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white py-3">
                 <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <Activity size={18} className="text-danger"/> Live System Alerts
                 </h6>
              </div>
              <div className="card-body">
                 {data.alerts.length === 0 ? (
                    <div className="text-center text-muted py-4">
                       <ShieldCheck size={48} className="mb-2 text-success opacity-50"/>
                       <p>All systems healthy. No actions required.</p>
                    </div>
                 ) : (
                    <ul className="list-group list-group-flush">
                       {data.alerts.map((alert, idx) => (
                          <li key={idx} className="list-group-item px-0 d-flex gap-3 align-items-start border-0">
                             <span className="mt-1 w-2 h-2 rounded-circle bg-danger"></span>
                             <span className="fw-medium text-dark">{alert}</span>
                          </li>
                       ))}
                    </ul>
                 )}
              </div>
           </div>
        </div>

        {/* 3. Real Audit Logs */}
        <div className="col-lg-6">
           <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white py-3">
                 <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <Clock size={18} className="text-primary"/> Recent Activity Logs
                 </h6>
              </div>
              <div className="card-body">
                  {data.logs.length === 0 ? (
                    <p className="text-muted text-center py-4">No recent activity recorded.</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                       {data.logs.map((log) => (
                          <li key={log._id} className="list-group-item px-0 border-0 mb-2">
                             <div className="d-flex justify-content-between">
                                <span className="fw-bold text-dark">{log.action}</span>
                                <small className="text-muted">{new Date(log.createdAt).toLocaleTimeString()}</small>
                             </div>
                             <small className="text-muted d-block">{log.details} • By {log.performedBy}</small>
                          </li>
                       ))}
                    </ul>
                  )}
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;