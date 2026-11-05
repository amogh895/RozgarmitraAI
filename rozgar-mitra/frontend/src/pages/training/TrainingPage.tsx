import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trainingApi } from '@/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import { Clock, MapPin, DollarSign, ExternalLink, BookOpen, AlertTriangle } from 'lucide-react';

interface Course {
  id: number;
  provider: string;
  title: string;
  category: string;
  duration_hours: number;
  mode: string;
  eligibility: string;
  cost_inr: number;
  location?: string;
  official_url: string;
  skills_taught: string[];
  status: string;
}

export default function TrainingPage() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [enrolled, setEnrolled] = useState<Set<number>>(new Set());

  useEffect(() => {
    trainingApi.list({ q, per_page: 20 }).then(r => setCourses(r.data.data)).finally(() => setLoading(false));
  }, [q]);

  const handleEnroll = async (id: number) => {
    if (!isAuthenticated || user?.role !== 'worker') {
      toast.error('Please log in as a worker to enroll.');
      return;
    }
    setEnrolling(id);
    try {
      await trainingApi.enroll(id);
      setEnrolled(prev => new Set([...prev, id]));
      toast.success('Enrolled successfully!');
    } catch {
      toast.error('Enrollment failed. Try again.');
    } finally {
      setEnrolling(null);
    }
  };

  const modeBadge = (mode: string) => {
    const map: Record<string, string> = { online: 'badge-blue', offline: 'badge-gray', hybrid: 'badge-green' };
    return <span className={map[mode] || 'badge-gray'}>{mode}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('training.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">Skill development courses for informal workers</p>
      </div>

      <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <AlertTriangle size={15} className="inline mr-1" />
        <strong>Sample Records:</strong> Course details are sample/unverified data for demonstration.
        Always verify availability, cost, and eligibility at the official provider website before enrolling.
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search courses, skills..." className="input pl-12"
          value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
      ) : courses.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">No courses found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map(course => (
            <div key={course.id} className="card flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="badge-amber text-xs mb-1 block">SAMPLE</span>
                    <h3 className="font-bold text-gray-900 leading-snug">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{course.provider}</p>
                  </div>
                  {modeBadge(course.mode)}
                </div>
                <div className="space-y-1.5 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2"><Clock size={14} className="text-gray-400" />{course.duration_hours}h duration</div>
                  <div className="flex items-center gap-2"><DollarSign size={14} className="text-gray-400" />
                    {course.cost_inr === 0 ? <span className="text-green-600 font-semibold">{t('training.free')}</span> : `₹${course.cost_inr}`}
                  </div>
                  {course.location && <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" />{course.location}</div>}
                </div>
                {course.skills_taught.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {course.skills_taught.slice(0, 4).map(s => <span key={s} className="badge-blue">{s}</span>)}
                  </div>
                )}
                {course.eligibility && (
                  <p className="text-xs text-gray-500"><strong>Eligibility:</strong> {course.eligibility}</p>
                )}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <a href={course.official_url} target="_blank" rel="noopener noreferrer"
                  className="btn-outline text-xs flex-1 flex items-center justify-center gap-1 py-2">
                  <ExternalLink size={13} />Official Site
                </a>
                {isAuthenticated && user?.role === 'worker' && (
                  <button onClick={() => handleEnroll(course.id)} disabled={enrolling === course.id || enrolled.has(course.id)}
                    className="btn-primary text-xs flex-1 py-2">
                    {enrolled.has(course.id) ? '✓ ' + t('training.enrolled') : enrolling === course.id ? t('common.loading') : t('training.enroll')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
