import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { jobsApi } from '@/api';
import toast from 'react-hot-toast';
import { MapPin, Briefcase, Calendar, ExternalLink, ChevronLeft, Heart, Check } from 'lucide-react';
import type { Job, JobMatchScore } from '@shared/index';

export default function JobDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [match, setMatch] = useState<JobMatchScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverNote, setCoverNote] = useState('');

  useEffect(() => {
    if (!id) return;
    jobsApi.getById(parseInt(id)).then(r => setJob(r.data.data)).finally(() => setLoading(false));
    if (isAuthenticated && user?.role === 'worker') {
      jobsApi.getMatch(parseInt(id)).then(r => setMatch(r.data.data)).catch(() => {});
    }
  }, [id, isAuthenticated, user]);

  const handleApply = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setApplying(true);
    try {
      await jobsApi.apply(parseInt(id!), { cover_note: coverNote });
      setApplied(true);
      setShowModal(false);
      toast.success('Application submitted!');
    } catch (err: any) {
      if (err.response?.status === 409) { setApplied(true); toast.error('Already applied'); }
      else toast.error('Application failed');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      if (saved) { await jobsApi.unsaveJob(parseInt(id!)); setSaved(false); toast.success('Removed from saved'); }
      else { await jobsApi.saveJob(parseInt(id!)); setSaved(true); toast.success('Job saved!'); }
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">{t('common.loading')}</div>;
  if (!job) return <div className="text-center py-20 text-gray-500">Job not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft size={16} />{t('common.back')} to jobs
      </Link>

      <div className="card mb-6">
        {job.is_demo && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-sm text-amber-800 font-medium">
            ⚠️ DEMO JOB — This is not a real job listing. For demonstration purposes only.
          </div>
        )}

        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 mt-1">{job.employer_name}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-outline flex items-center gap-2 text-sm">
              <Heart size={16} className={saved ? 'fill-red-500 text-red-500' : ''} />
              {saved ? t('jobs.saved') : t('jobs.save')}
            </button>
            {!applied ? (
              <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
                <Briefcase size={16} />{t('jobs.apply')}
              </button>
            ) : (
              <span className="btn-primary text-sm flex items-center gap-2 opacity-70 cursor-default">
                <Check size={16} />Applied
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-5">
          <div className="flex items-center gap-2 text-gray-600"><MapPin size={16} className="text-gray-400" />{job.location_district}, {job.location_state}</div>
          <div className="flex items-center gap-2 text-gray-600">💰 ₹{job.wage_min}–{job.wage_max}/{job.wage_unit}</div>
          <div className="flex items-center gap-2 text-gray-600"><Briefcase size={16} className="text-gray-400" />{job.employment_type.replace('_',' ')}</div>
          <div className="flex items-center gap-2 text-gray-600"><Calendar size={16} className="text-gray-400" />Expires {new Date(job.expiry_date).toLocaleDateString()}</div>
          <div className="flex items-center gap-2 text-gray-600">📂 {job.category}</div>
        </div>

        {job.required_skills.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">{job.required_skills.map(s => <span key={s} className="badge-blue">{s}</span>)}</div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        <div className="text-sm text-gray-600">
          <strong>How to apply:</strong> {job.application_method}
        </div>
      </div>

      {/* Match score */}
      {match && (
        <div className="card mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Your Match Score</h3>
          <div className="flex items-center gap-4 mb-3">
            <div className="text-4xl font-extrabold text-brand-600">{match.score}%</div>
            <div className="flex-1">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-3 rounded-full transition-all" style={{ width: `${match.score}%`, background: match.score >= 60 ? '#16a34a' : match.score >= 40 ? '#d97706' : '#ef4444' }} />
              </div>
              <p className="text-sm text-gray-500 mt-1">{match.explanation}</p>
            </div>
          </div>
          {match.matched_skills.length > 0 && (
            <div className="mb-2">
              <span className="text-xs font-semibold text-green-700">✓ Matched: </span>
              {match.matched_skills.map(s => <span key={s} className="badge-green mr-1">{s}</span>)}
            </div>
          )}
          {match.missing_skills.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-amber-700">⚡ To develop: </span>
              {match.missing_skills.map(s => <span key={s} className="badge-amber mr-1">{s}</span>)}
            </div>
          )}
        </div>
      )}

      {/* Apply modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold">{t('jobs.applyModal')}</h2>
            <p className="text-sm text-gray-600"><strong>{job.title}</strong> at {job.employer_name}</p>
            <div>
              <label className="label">{t('jobs.coverNote')}</label>
              <textarea className="input h-28 resize-none" placeholder="Briefly introduce yourself..." value={coverNote} onChange={e => setCoverNote(e.target.value)} maxLength={1000} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1">{t('common.cancel')}</button>
              <button onClick={handleApply} disabled={applying} className="btn-primary flex-1">
                {applying ? t('common.loading') : t('jobs.submitApplication')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
