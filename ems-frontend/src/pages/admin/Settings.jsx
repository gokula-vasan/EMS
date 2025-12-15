import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Bell, Lock, Globe, Moon, Building } from 'lucide-react';
import API from '../../utils/axiosHelper';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    companyName: '',
    contactEmail: '',
    address: '',
    allowRemoteClockIn: false,
    darkMode: false,
    autoApproveLeave: false,
    maintenanceMode: false
  });

  // 1. Fetch Real Settings on Load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        setConfig(data);
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 2. Handle Text Input Changes
  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  // 3. Handle Toggles
  const handleToggle = (key) => {
    setConfig({ ...config, [key]: !config[key] });
  };

  // 4. Save to Database
  const handleSave = async () => {
    try {
      const { data } = await API.put('/settings', config);
      setConfig(data); // Update state with confirmed data from server
      toast.success('System configuration saved successfully!');
    } catch (error) {
      toast.error('Failed to save changes');
    }
  };

  if (loading) return <div className="p-5 text-center">Loading configuration...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0 pb-5">
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">Configuration</h3>
        <p className="text-muted">Manage global settings and company profile.</p>
      </div>

      <div className="row g-4">
        {/* Company Profile Section */}
        <div className="col-12">
           <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                 <Building size={20} className="text-primary"/> Company Profile
              </h5>
              <div className="row g-3">
                 <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Company Name</label>
                    <input 
                      type="text" 
                      name="companyName"
                      className="form-control" 
                      value={config.companyName} 
                      onChange={handleChange} 
                    />
                 </div>
                 <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Contact Email</label>
                    <input 
                      type="email" 
                      name="contactEmail"
                      className="form-control" 
                      value={config.contactEmail} 
                      onChange={handleChange} 
                    />
                 </div>
                 <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Office Address</label>
                    <textarea 
                      name="address"
                      className="form-control" 
                      rows="2"
                      value={config.address} 
                      onChange={handleChange} 
                    ></textarea>
                 </div>
              </div>
              <div className="mt-3 text-end">
                  <button onClick={handleSave} className="btn btn-primary d-inline-flex align-items-center gap-2">
                     <Save size={18}/> Save Changes
                  </button>
              </div>
           </div>
        </div>

        {/* Feature Toggles Section */}
        <div className="col-lg-6">
           <div className="card border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                 <Globe size={20} className="text-primary"/> Feature Toggles
              </h5>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                 <label className="fw-medium">Allow Remote Clock-in</label>
                 <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" 
                       style={{width: '3em', height: '1.5em'}}
                       checked={config.allowRemoteClockIn} 
                       onChange={() => handleToggle('allowRemoteClockIn')} />
                 </div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                 <label className="fw-medium">Enable Dark Mode (Beta)</label>
                 <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" 
                       style={{width: '3em', height: '1.5em'}}
                       checked={config.darkMode} 
                       onChange={() => handleToggle('darkMode')} />
                 </div>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                 <label className="fw-medium">Auto-Approve Sick Leave</label>
                 <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" 
                       style={{width: '3em', height: '1.5em'}}
                       checked={config.autoApproveLeave} 
                       onChange={() => handleToggle('autoApproveLeave')} />
                 </div>
              </div>
           </div>
        </div>

        {/* Maintenance Section */}
        <div className="col-lg-6">
           <div className="card border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                 <Lock size={20} className="text-danger"/> Danger Zone
              </h5>
              <div className="alert alert-warning border-0 d-flex gap-3 align-items-start">
                 <Bell className="mt-1" size={18}/>
                 <div>
                    <h6 className="fw-bold mb-1">Maintenance Mode</h6>
                    <p className="mb-2 small">Prevent non-admin users from accessing the system.</p>
                    <button 
                       className={`btn btn-sm ${config.maintenanceMode ? 'btn-danger' : 'btn-outline-dark'}`}
                       onClick={() => {
                          handleToggle('maintenanceMode');
                          // We trigger save immediately for this critical toggle
                          setTimeout(handleSave, 100); 
                       }}
                    >
                       {config.maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Settings;