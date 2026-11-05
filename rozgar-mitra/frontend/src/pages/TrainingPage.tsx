import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trainingApi } from '@/api';
import { ExternalLink, BookOpen, Clock, CheckCircle } from 'lucide-react';

export default function TrainingPage() {
  const { i18n } = useTranslation();
  const hi = i18n.language === 'hi';
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    trainingApi.list({ q }).then(r => setCourses(r.data.data)).finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">{hi ? 'कौशल प्रशिक्षण' : 'Skill Training'}</h1>
      <p className="text-gray-500 text-sm mb-5">
        {hi ? 'सरकारी निःशुल्क प्रशिक्षण कार्यक्रम' : 'Official government training programmes — free or subsidised'}
      </p>

      <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 flex gap-2">
        <CheckCircle size={16} className="shrink-0 mt-0.5 text-green-600" />
        {hi ? 'सभी कोर्स आधिकारिक सरकारी कार्यक्रम हैं। नामांकन के लिए आधिकारिक वेबसाइट पर जाएं।'
           : 'All courses listed are official government programmes. Visit the official website to enroll.'}
      </div>

      <div className="relative mb-6">
        <BookOpen size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-11" placeholder={hi ? 'कोर्स खोजें...' : 'Search courses...'}
          value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">{hi ? 'लोड हो रहा है...' : 'Loading...'}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map(c => (
            <div key={c.id} className="card flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    {c.status === 'verified' && <span className="badge-green text-xs mb-1 inline-flex items-center gap-1"><CheckCircle size={10} />Verified</span>}
                    <h3 className="font-bold text-gray-900 leading-snug mt-1">{c.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{c.provider}</p>
                  </div>
                  <span className={`badge text-xs ${c.mode === 'online' ? 'badge-blue' : c.mode === 'hybrid' ? 'badge-green' : 'badge-gray'}`}>{c.mode}</span>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2"><Clock size={13} className="text-gray-400" />{c.duration_hours}h</div>
                  <div className="flex items-center gap-2">💰 {c.cost_inr === 0 ? <span className="text-green-600 font-semibold">{hi ? 'निःशुल्क' : 'Free'}</span> : `₹${c.cost_inr}`}</div>
                </div>
                {c.eligibility && <p className="text-xs text-gray-500 mb-3"><strong>{hi ? 'पात्रता:' : 'Eligibility:'}</strong> {c.eligibility}</p>}
                {c.skills_taught?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(typeof c.skills_taught[0] === 'string' ? c.skills_taught : []).slice(0, 3).map((s: string) => <span key={s} className="badge-blue text-xs">{s.length > 40 ? s.substring(0, 40) + '…' : s}</span>)}
                  </div>
                )}
              </div>
              <a href={c.official_url} target="_blank" rel="noopener noreferrer"
                className="btn-primary text-xs py-2.5 flex items-center justify-center gap-2 mt-3">
                <ExternalLink size={13} />{hi ? 'आधिकारिक साइट पर जाएं' : 'Visit Official Site'}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
