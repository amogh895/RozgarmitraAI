import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { schemesApi } from '@/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import { ExternalLink, Search, CheckCircle, AlertTriangle } from 'lucide-react';

interface Scheme {
  id: number;
  name: string;
  issuing_authority: string;
  summary: string;
  eligibility_conditions: string;
  documents_required: string;
  benefits: string;
  official_url: string;
  last_verified_date: string;
  status: 'unverified' | 'verified' | 'discontinued';
}

export default function SchemesPage() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [eligResult, setEligResult] = useState<Record<number, any>>({});
  const [checking, setChecking] = useState<number | null>(null);

  useEffect(() => {
    schemesApi.list({ q, per_page: 20 }).then(r => setSchemes(r.data.data)).finally(() => setLoading(false));
  }, [q]);

  const checkEligibility = async (id: number) => {
    if (!isAuthenticated || user?.role !== 'worker') {
      toast.error('Please log in as a worker to check eligibility.');
      return;
    }
    setChecking(id);
    try {
      const res = await schemesApi.checkEligibility(id);
      setEligResult(prev => ({ ...prev, [id]: res.data.data }));
    } catch {
      toast.error('Could not check eligibility. Try again.');
    } finally {
      setChecking(null);
    }
  };

  const statusBadge = (status: string) => {
    if (status === 'verified') return <span className="badge-green flex items-center gap-1"><CheckCircle size={12} />Verified</span>;
    if (status === 'unverified') return <span className="badge-amber flex items-center gap-1"><AlertTriangle size={12} />{t('schemes.unverified')}</span>;
    return <span className="badge-red">Discontinued</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('schemes.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">Government welfare programmes for informal workers</p>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <strong>⚠️ Important Disclaimer:</strong> Scheme information below is {' '}
        <strong>UNVERIFIED</strong> and may be outdated. Always verify details at the official government websites
        before applying. RozgarMitra AI cannot guarantee eligibility or benefits.
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search schemes..." className="input pl-12"
          value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
      ) : schemes.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">No schemes found.</div>
      ) : (
        <div className="space-y-4">
          {schemes.map(scheme => (
            <div key={scheme.id} className="card">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-bold text-gray-900">{scheme.name}</h2>
                    {statusBadge(scheme.status)}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{scheme.issuing_authority} · Last checked: {scheme.last_verified_date}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{scheme.summary}</p>
                </div>
              </div>

              {/* Expand/collapse */}
              <button onClick={() => setExpanded(expanded === scheme.id ? null : scheme.id)}
                className="mt-3 text-sm text-brand-600 hover:underline font-medium">
                {expanded === scheme.id ? '▲ Show less' : '▼ Show more details'}
              </button>

              {expanded === scheme.id && (
                <div className="mt-4 space-y-3 text-sm border-t border-gray-100 pt-4">
                  {scheme.eligibility_conditions && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Eligibility</h3>
                      <p className="text-gray-600">{scheme.eligibility_conditions}</p>
                    </div>
                  )}
                  {scheme.benefits && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Benefits</h3>
                      <p className="text-gray-600">{scheme.benefits}</p>
                    </div>
                  )}
                  {scheme.documents_required && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Documents Required</h3>
                      <p className="text-gray-600">{scheme.documents_required}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a href={scheme.official_url} target="_blank" rel="noopener noreferrer"
                      className="btn-secondary text-sm flex items-center gap-2 py-2 px-4">
                      <ExternalLink size={15} />{t('schemes.officialSite')}
                    </a>
                    {isAuthenticated && user?.role === 'worker' && (
                      <button onClick={() => checkEligibility(scheme.id)} disabled={checking === scheme.id}
                        className="btn-primary text-sm py-2 px-4">
                        {checking === scheme.id ? t('common.loading') : t('schemes.checkEligibility')}
                      </button>
                    )}
                  </div>

                  {/* Eligibility result */}
                  {eligResult[scheme.id] && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="font-semibold text-blue-800 mb-1">Preliminary Check Result</p>
                      <p className="text-sm text-blue-700 mb-2">
                        Status: <strong>Potentially Eligible</strong> (preliminary only)
                      </p>
                      {eligResult[scheme.id].signals?.length > 0 && (
                        <ul className="text-sm text-blue-700 list-disc list-inside space-y-0.5">
                          {eligResult[scheme.id].signals.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      )}
                      <p className="text-xs text-blue-600 mt-2">{eligResult[scheme.id].disclaimer}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
