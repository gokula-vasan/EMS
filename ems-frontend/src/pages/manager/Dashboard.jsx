import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Clock, Loader } from 'lucide-react';
import API from '../../utils/axiosHelper';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    onLeave: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/manager/dashboard-stats');
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-5 text-center text-muted"><Loader className="animate-spin mb-2"/> Loading insights...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      <div className="mb-4 d-flex justify-content-between align-items-end">
        <div>
          <h3 className="fw-bold text-dark mb-1">Team Overview</h3>
          <p className="text-muted mb-0">Live insights from your Engineering Squad.</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {[
          { title: "Total Team", value: stats.totalEmployees, icon: Users, color: "primary", bg: "bg-primary-subtle" },
          { title: "Present Now", value: stats.presentToday, icon: UserCheck, color: "success", bg: "bg-success-subtle" },
          { title: "On Leave", value: stats.onLeave, icon: UserX, color: "warning", bg: "bg-warning-subtle" },
          { title: "Pending Requests", value: stats.pendingLeaves, icon: Clock, color: "danger", bg: "bg-danger-subtle" },
        ].map((stat, idx) => (
          <div className="col-md-3" key={idx}>
            <div className="card h-100 border-0 shadow-sm p-3">
              <div className="d-flex align-items-center gap-3">
                <div className={`p-3 rounded-circle ${stat.bg} text-${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{stat.value}</h3>
                  <small className="text-muted text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>{stat.title}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ManagerDashboard;