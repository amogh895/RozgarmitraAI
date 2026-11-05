import { useEffect, useState } from 'react';
import { adminApi, jobsApi } from '@/api';
import toast from 'react-hot-toast';
import { Users, Briefcase, CheckCircle, XCircle, BarChart2, ShieldAlert } from 'lucide-react';

interface Stats {
  total_users: number; total_workers: number; total_employers: number;
  total_jobs: number; active_jobs: number; pending_jobs: number;
  total_applications: number; total_chat_sessions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tab, setTab] = useState<'overview' | 'jobs' | 'users' | 'logs'>('overview');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getStats().then(r => setStats(r.data.data)),
      adminApi.getPendingJobs().then(r => setPendingJobs(r.data.data)),
      adminApi.getUsers().then(r => setUsers(r.data.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const loadLogs = async () => {
    const res = await adminApi.getAuditLogs();
    setLogs(res.data.data);
  };

  const moderateJob = async (id: number, status: 'active' | 'rejected') => {
    await adminApi.moderateJob(id, status);
    setPendingJobs(prev => prev.filter(j => j.id !== id));
    toast.success(`Job ${status}`);
  };

  const toggleUser = async (id: number, is_active: boolean) => {
    await adminApi.setUserStatus(id, !is_active);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !is_active } : u));
    toast.success('User status updated');
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const TABS = [
    { key: 'overview', label: 'Overview', icon: <BarChart2 size={16} /> },
    { key: 'jobs', label: `Job Moderation (${pendingJobs.length})`, icon: <Briefcase size={16} /> },
    { key: 'users', label: `Users (${users.length})`, icon: <Users size={16} /> },
    { key: 'logs', label: 'Audit Logs', icon: <ShieldAlert size={16} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key as any); if (t.key === 'logs') loadLogs(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? 'bg-white shadow text-brand-700' : 'text-gray-600 hover:text-gray-900'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.total_users, icon: '👤' },
            { label: 'Workers', value: stats.total_workers, icon: '👷' },
            { label: 'Employers', value: stats.total_employers, icon: '🏢' },
            { label: 'Active Jobs', value: stats.active_jobs, icon: '💼' },
            { label: 'Pending Jobs', value: stats.pending_jobs, icon: '⏳' },
            { label: 'Total Jobs', value: stats.total_jobs, icon: '📋' },
            { label: 'Applications', value: stats.total_applications, icon: '📨' },
            { label: 'Chat Sessions', value: stats.total_chat_sessions, icon: '🤖' },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Job Moderation */}
      {tab === 'jobs' && (
        <div className="space-y-3">
          {pendingJobs.length === 0 ? (
            <div className="card text-center text-gray-500 py-10">No pending jobs to review.</div>
          ) : pendingJobs.map(job => (
            <div key={job.id} className="card flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-gray-500">{job.category} · {job.location_state} · by {job.company_name}</p>
                <p className="text-xs text-gray-400">{job.employer_email} · Submitted {new Date(job.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => moderateJob(job.id, 'active')}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                  <CheckCircle size={15} />Approve
                </button>
                <button onClick={() => moderateJob(job.id, 'rejected')}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                  <XCircle size={15} />Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="card flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold text-sm">{u.full_name}</p>
                <p className="text-xs text-gray-500">{u.email} · <span className="capitalize">{u.role}</span></p>
              </div>
              <div className="flex items-center gap-3">
                <span className={u.is_active ? 'badge-green' : 'badge-red'}>{u.is_active ? 'Active' : 'Disabled'}</span>
                {u.role !== 'admin' && (
                  <button onClick={() => toggleUser(u.id, u.is_active)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${u.is_active ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}>
                    {u.is_active ? 'Disable' : 'Enable'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Logs */}
      {tab === 'logs' && (
        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="card text-center text-gray-500 py-10">No audit logs yet.</div>
          ) : logs.map(log => (
            <div key={log.id} className="card flex items-start gap-3 text-sm">
              <div className="text-gray-400 text-xs w-36 shrink-0">{new Date(log.created_at).toLocaleString()}</div>
              <div>
                <span className="font-medium capitalize">{log.actor_role || 'system'}</span>
                {' '}<span className="text-gray-700">{log.action}</span>
                {log.entity_type && <span className="text-gray-400"> on {log.entity_type}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
