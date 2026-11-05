import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { jobsApi, usersApi } from '@/api';
import { Briefcase, BookOpen, Heart, MessageSquare, TrendingUp, Edit } from 'lucide-react';
import type { Job, JobApplication } from '@shared/index';

export default function WorkerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [recommended, setRecommended] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [saved, setSaved] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobsApi.search({ per_page: 6 }).then(r => setRecommended(r.data.data)),
      jobsApi.getApplications().then(r => setApplications(r.data.data)).catch(() => {}),
      jobsApi.getSaved().then(r => setSaved(r.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="text-gray-500">{t('common.loading')}</div></div>;

  const statusColor: Record<string, string> = {
    applied: 'badge-blue', viewed: 'badge-amber', shortlisted: 'badge-green', rejected: 'badge-red', hired: 'badge-green',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.welcome')} {user?.full_name} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Find jobs, get mentorship, and grow your career</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link to="/onboarding" className="btn-outline text-sm flex items-center gap-2"><Edit size={16} />{t('dashboard.editProfile')}</Link>
          <Link to="/mentor" className="btn-primary text-sm flex items-center gap-2"><MessageSquare size={16} />AI Mentor</Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Briefcase size={20} />, label: 'Applications', value: applications.length, color: 'text-brand-600 bg-brand-50' },
          { icon: <Heart size={20} />, label: 'Saved Jobs', value: saved.length, color: 'text-red-500 bg-red-50' },
          { icon: <TrendingUp size={20} />, label: 'Matched Jobs', value: recommended.length, color: 'text-green-600 bg-green-50' },
          { icon: <BookOpen size={20} />, label: 'Schemes', value: '5+', color: 'text-teal-600 bg-teal-50' },
        ].map(stat => (
          <div key={stat.label} className="card flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Jobs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{t('dashboard.recommended')}</h2>
          <Link to="/jobs" className="text-sm text-brand-600 hover:underline">View all →</Link>
        </div>
        {recommended.length === 0 ? (
          <div className="card text-center text-gray-500 py-8">{t('jobs.noJobs')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="card hover:shadow-md transition-shadow">
                {job.is_demo && <span className="badge-amber text-xs mb-2 inline-block">DEMO</span>}
                <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{job.employer_name} · {job.location_district}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-teal-700">₹{job.wage_min}–{job.wage_max}/{job.wage_unit}</span>
                  <span className="badge-blue text-xs">{job.category}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Applications */}
      <section>
        <h2 className="text-lg font-bold mb-4">{t('dashboard.applications')}</h2>
        {applications.length === 0 ? (
          <div className="card text-center text-gray-500 py-6">No applications yet. <Link to="/jobs" className="text-brand-600">Find jobs →</Link></div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((app: any) => (
              <div key={app.id} className="card flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-semibold text-sm">{app.job_title}</p>
                  <p className="text-xs text-gray-500">{app.employer_name} · {new Date(app.applied_at).toLocaleDateString()}</p>
                </div>
                <span className={`${statusColor[app.status] || 'badge-gray'}`}>{app.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick links */}
      <section>
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/mentor', icon: '🤖', label: 'Career Advice' },
            { to: '/schemes', icon: '📋', label: 'Govt. Schemes' },
            { to: '/training', icon: '📚', label: 'Learn Skills' },
            { to: '/jobs', icon: '🔍', label: 'Search Jobs' },
          ].map(item => (
            <Link key={item.to} to={item.to} className="card text-center hover:shadow-md transition-shadow py-6">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-sm font-medium text-gray-700">{item.label}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
