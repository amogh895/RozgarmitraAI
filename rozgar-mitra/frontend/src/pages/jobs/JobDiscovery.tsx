import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jobsApi } from '@/api';
import { Search, Filter, MapPin, DollarSign, Briefcase } from 'lucide-react';
import type { Job } from '@shared/index';

export default function JobDiscovery() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState({ q: '', category: '', state: '', employment_type: '' });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobsApi.search({ ...filters, page, per_page: 12 });
      setJobs(res.data.data);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);
  useEffect(() => { jobsApi.getCategories().then(r => setCategories(r.data.data)); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('jobs.title')}</h1>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder={t('jobs.search')} className="input pl-12"
            value={filters.q} onChange={e => { setFilters({ ...filters, q: e.target.value }); setPage(1); }} />
        </div>
        <button className="btn-outline flex items-center gap-2"><Filter size={18} />{t('jobs.filter')}</button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select className="input w-auto py-2 px-3 text-sm h-10" value={filters.category}
          onChange={e => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input w-auto py-2 px-3 text-sm h-10" value={filters.employment_type}
          onChange={e => { setFilters({ ...filters, employment_type: e.target.value }); setPage(1); }}>
          <option value="">All Types</option>
          <option value="daily_wage">Daily Wage</option>
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="gig">Gig</option>
        </select>
        <input type="text" placeholder="State..." className="input w-36 py-2 px-3 text-sm h-10"
          value={filters.state} onChange={e => { setFilters({ ...filters, state: e.target.value }); setPage(1); }} />
      </div>

      {/* Demo notice */}
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        ⚠️ <strong>Demo Notice:</strong> All jobs are clearly labelled DEMO and are for demonstration purposes only. They are not real job openings.
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500 mb-4">{total} job{total !== 1 ? 's' : ''} found</p>

      {loading ? (
        <div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">{t('jobs.noJobs')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}

      {/* Pagination */}
      {total > 12 && (
        <div className="flex justify-center gap-3 mt-8">
          <button className="btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="flex items-center text-sm text-gray-600">Page {page} of {Math.ceil(total / 12)}</span>
          <button className="btn-outline" disabled={page * 12 >= total} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link to={`/jobs/${job.id}`} className="card hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          {job.is_demo && <span className="badge-amber text-xs mb-1 block">DEMO</span>}
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors leading-snug">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{job.employer_name}</p>
        </div>
        <span className="badge-blue text-xs whitespace-nowrap">{job.category}</span>
      </div>
      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" />{job.location_district}, {job.location_state}</div>
        <div className="flex items-center gap-2"><DollarSign size={14} className="text-gray-400" />₹{job.wage_min}–{job.wage_max}/{job.wage_unit}</div>
        <div className="flex items-center gap-2"><Briefcase size={14} className="text-gray-400" />{job.employment_type.replace('_', ' ')}</div>
      </div>
      {job.required_skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.required_skills.slice(0, 3).map(s => <span key={s} className="badge-gray">{s}</span>)}
          {job.required_skills.length > 3 && <span className="text-xs text-gray-400">+{job.required_skills.length - 3}</span>}
        </div>
      )}
      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
        Posted {new Date(job.posted_date).toLocaleDateString()} · Expires {new Date(job.expiry_date).toLocaleDateString()}
      </div>
    </Link>
  );
}
