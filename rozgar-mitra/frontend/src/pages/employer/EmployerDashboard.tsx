import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { jobsApi } from '@/api';
import toast from 'react-hot-toast';
import { Plus, X, Eye, Users, CheckCircle, XCircle } from 'lucide-react';
import type { Job } from '@shared/index';

const EMPTY_FORM = {
  title: '', category: '', location_district: '', location_state: '',
  wage_min: 0, wage_max: 0, wage_unit: 'daily' as const,
  employment_type: 'full_time' as const,
  required_skills: [] as string[],
  description: '', application_method: 'apply_online',
  expiry_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
};

export default function EmployerDashboard() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    jobsApi.getMyJobs().then(r => setJobs(r.data.data)).finally(() => setLoading(false));
  }, []);

  const loadApplicants = async (job: Job) => {
    setSelectedJob(job);
    const res = await jobsApi.getApplicants(job.id);
    setApplicants(res.data.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await jobsApi.createJob(form);
      setJobs(prev => [res.data.data, ...prev]);
      setShowForm(false);
      setForm({ ...EMPTY_FORM });
      toast.success('Job submitted for review!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async (id: number) => {
    await jobsApi.closeJob(id);
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'closed' } : j));
    toast.success('Job closed');
  };

  const statusBadge: Record<string, string> = { active: 'badge-green', pending: 'badge-amber', closed: 'badge-gray', rejected: 'badge-red' };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employer Dashboard</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />Post a Job
        </button>
      </div>

      {/* Create job form */}
      {showForm && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Post New Job</h2>
          <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-xl mb-4">
            ⚠️ Jobs are reviewed before being published. Do not post misleading information.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label">Job Title *</label><input className="input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><label className="label">Category *</label><input className="input" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
              <div><label className="label">District *</label><input className="input" required value={form.location_district} onChange={e => setForm({...form, location_district: e.target.value})} /></div>
              <div><label className="label">State *</label><input className="input" required value={form.location_state} onChange={e => setForm({...form, location_state: e.target.value})} /></div>
              <div><label className="label">Min Wage (₹)</label><input type="number" className="input" value={form.wage_min} onChange={e => setForm({...form, wage_min: +e.target.value})} /></div>
              <div><label className="label">Max Wage (₹)</label><input type="number" className="input" value={form.wage_max} onChange={e => setForm({...form, wage_max: +e.target.value})} /></div>
              <div><label className="label">Wage Unit</label>
                <select className="input" value={form.wage_unit} onChange={e => setForm({...form, wage_unit: e.target.value as any})}>
                  <option value="hourly">Hourly</option><option value="daily">Daily</option><option value="monthly">Monthly</option>
                </select>
              </div>
              <div><label className="label">Employment Type</label>
                <select className="input" value={form.employment_type} onChange={e => setForm({...form, employment_type: e.target.value as any})}>
                  <option value="full_time">Full Time</option><option value="part_time">Part Time</option>
                  <option value="contract">Contract</option><option value="daily_wage">Daily Wage</option><option value="gig">Gig</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Required Skills</label>
              <div className="flex gap-2 mb-2">
                <input className="input flex-1" placeholder="Add skill and press Enter" value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (skillInput.trim()) { setForm({...form, required_skills: [...form.required_skills, skillInput.trim()]}); setSkillInput(''); }}}} />
                <button type="button" className="btn-outline" onClick={() => { if (skillInput.trim()) { setForm({...form, required_skills: [...form.required_skills, skillInput.trim()]}); setSkillInput(''); }}}>Add</button>
              </div>
              <div className="flex flex-wrap gap-2">{form.required_skills.map((s, i) => <span key={i} className="badge-blue flex items-center gap-1">{s}<button type="button" onClick={() => setForm({...form, required_skills: form.required_skills.filter((_, j) => j !== i)})}><X size={12} /></button></span>)}</div>
            </div>
            <div><label className="label">Description</label><textarea className="input h-24 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div><label className="label">Expiry Date</label><input type="date" className="input" value={form.expiry_date} onChange={e => setForm({...form, expiry_date: e.target.value})} /></div>
            <div className="flex gap-3">
              <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>{t('common.cancel')}</button>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? t('common.loading') : 'Submit for Review'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs list */}
      <section>
        <h2 className="text-lg font-bold mb-4">My Jobs ({jobs.length})</h2>
        {loading ? <div className="text-gray-400">{t('common.loading')}</div> : jobs.length === 0 ? (
          <div className="card text-center text-gray-500 py-8">No jobs yet. Post your first job above.</div>
        ) : (
          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job.id} className="card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{job.title}</h3>
                    <span className={statusBadge[job.status] || 'badge-gray'}>{job.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">{job.category} · {job.location_district}, {job.location_state}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => loadApplicants(job)} className="btn-outline text-xs flex items-center gap-1"><Users size={14} />Applicants</button>
                  {job.status === 'active' && (
                    <button onClick={() => handleClose(job.id)} className="btn-outline text-xs text-red-600 border-red-200 flex items-center gap-1"><XCircle size={14} />Close</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Applicants panel */}
      {selectedJob && (
        <section className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Applicants for: {selectedJob.title}</h2>
            <button onClick={() => { setSelectedJob(null); setApplicants([]); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          {applicants.length === 0 ? (
            <p className="text-gray-500 text-sm">No applicants yet.</p>
          ) : (
            <div className="space-y-3">
              {applicants.map((app: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl flex-wrap gap-3">
                  <div>
                    <p className="font-semibold text-sm">{app.full_name}</p>
                    <p className="text-xs text-gray-500">{app.experience_years}yr exp · {app.district || 'Location not set'}</p>
                    <div className="flex flex-wrap gap-1 mt-1">{app.skills?.slice(0,4).map((s: string) => <span key={s} className="badge-gray text-xs">{s}</span>)}</div>
                  </div>
                  <div className="flex gap-2">
                    <select className="input w-36 text-xs py-1 h-9"
                      value={app.status}
                      onChange={async (e) => { await jobsApi.updateAppStatus(app.id, e.target.value); toast.success('Status updated'); }}>
                      <option value="applied">Applied</option>
                      <option value="viewed">Viewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
