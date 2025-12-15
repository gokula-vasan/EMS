import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, ShieldCheck, Activity, UserPlus, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../utils/axiosHelper';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPayroll: 0,
    systemStatus: 'Healthy',
    logs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Users to count them
        const usersRes = await API.get('/admin/users');
        
        // 2. Fetch Payroll to sum it up
        // Note: We wrap this in a try/catch because if no payrolls exist, it might return empty
        let totalPay = 0;
        try {
           const payrollRes = await API.get('/payroll/all'); 
           totalPay = payrollRes.data.reduce((acc, curr) => acc + curr.netPay, 0);
        } catch (err) {
           console.log("No payroll data yet");
        }

        setStats({
          totalEmployees: usersRes.data.length,
          totalPayroll: totalPay,
          systemStatus: 'Healthy',
          logs: 24 // Mocking logs for now as we don't have a Logs collection
        });

      } catch (error) {
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  if (loading) {
     return <div className="p-5 text-center text-muted"><Loader className="animate-spin mb-2"/> Loading dashboard...</div>;
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="container-fluid p-0"
    >
      <div className="mb-4">
        <h3 className="fw-bold text-dark">System Overview</h3>
        <p className="text-muted">Control panel for EMS Nexus.</p>
      </div>

      {/* 1. Top Stats Row (DYNAMIC) */}
      <div className="row g-4 mb-5">
        {[
          { label: 'Total Employees', val: stats.totalEmployees, icon: Users, color: 'primary' },
          { label: 'Total Payroll (YTD)', val: `₹ ${stats.totalPayroll.toLocaleString('en-IN')}`, icon: DollarSign, color: 'success' },
          { label: 'System Status', val: stats.systemStatus, icon: Activity, color: 'info' },
          { label: 'Admin Logs', val: `${stats.logs} New`, icon: ShieldCheck, color: 'warning' }
        ].map((item, i) => (
          <div key={i} className="col-md-6 col-lg-3">
            <motion.div 
               whileHover={{ y: -5 }}
               className="card border-0 shadow-sm p-3 h-100"
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                   <p className="text-muted text-uppercase fw-bold small mb-1">{item.label}</p>
                   <h3 className="fw-bold mb-0 text-dark">{item.val}</h3>
                </div>
                <div className={`p-2 rounded bg-${item.color}-subtle text-${item.color}`}>
                   <item.icon size={22} />
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* 2. Quick Actions */}
        <div className="col-lg-8">
           <div className="card border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4">Management Console</h5>
              <div className="row g-3">
                 <div className="col-md-6">
                    <Link to="/admin/users" className="text-decoration-none">
                        <button className="btn btn-light w-100 p-4 text-start border h-100 d-flex flex-column gap-3 hover-shadow transition-all">
                           <div className="bg-primary text-white p-2 rounded-circle w-auto d-inline-block"><UserPlus size={20}/></div>
                           <div>
                              <h6 className="fw-bold text-dark">Onboard New Employee</h6>
                              <p className="small text-muted mb-0">Start the wizard to add a new user to the system.</p>
                           </div>
                        </button>
                    </Link>
                 </div>
                 <div className="col-md-6">
                    <Link to="/admin/payroll" className="text-decoration-none">
                        <button className="btn btn-light w-100 p-4 text-start border h-100 d-flex flex-column gap-3 hover-shadow transition-all">
                           <div className="bg-success text-white p-2 rounded-circle w-auto d-inline-block"><DollarSign size={20}/></div>
                           <div>
                              <h6 className="fw-bold text-dark">Run Payroll Batch</h6>
                              <p className="small text-muted mb-0">Execute salary processing for the current month.</p>
                           </div>
                        </button>
                    </Link>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. System Alerts */}
        <div className="col-lg-4">
           <div className="card border-0 shadow-sm p-4 h-100 bg-dark text-white" style={{background: '#1e293b'}}>
              <h5 className="fw-bold mb-4 text-white">System Alerts</h5>
              <div className="d-flex flex-column gap-3">
                 <div className="d-flex gap-3 align-items-start">
                    <div className="mt-1"><div className="w-2 h-2 rounded-circle bg-danger"></div></div>
                    <div>
                       <p className="mb-0 fw-medium text-white small">Database Backup Due</p>
                       <small className="text-white-50" style={{fontSize: '0.75rem'}}>2 hours ago</small>
                    </div>
                 </div>
                 <div className="d-flex gap-3 align-items-start">
                    <div className="mt-1"><div className="w-2 h-2 rounded-circle bg-warning"></div></div>
                    <div>
                       <p className="mb-0 fw-medium text-white small">3 Users Locked Out</p>
                       <small className="text-white-50" style={{fontSize: '0.75rem'}}>5 hours ago</small>
                    </div>
                 </div>
                 <div className="d-flex gap-3 align-items-start">
                    <div className="mt-1"><div className="w-2 h-2 rounded-circle bg-success"></div></div>
                    <div>
                       <p className="mb-0 fw-medium text-white small">Patch v2.4.0 Applied</p>
                       <small className="text-white-50" style={{fontSize: '0.75rem'}}>Yesterday</small>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;