import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { schemesApi } from '@/api';
import { ExternalLink, Search, CheckCircle } from 'lucide-react';

export default function SchemesPage() {
  const { i18n } = useTranslation();
  const hi = i18n.language === 'hi';
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    schemesApi.list({ q, per_page: 20 }).then(r => setSchemes(r.data.data)).finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">{hi ? 'सरकारी योजनाएं' : 'Government Schemes'}</h1>
      <p className="text-gray-500 text-sm mb-5">
        {hi ? 'अनौपचारिक कामगारों के लिए सरकारी कल्याण योजनाएं' : 'Official welfare programmes for informal workers in India'}
      </p>

      <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 flex gap-2">
        <CheckCircle size={16} className="shrink-0 mt-0.5 text-green-600" />
        {hi ? 'सभी जानकारी आधिकारिक सरकारी वेबसाइटों से ली गई है। आवेदन से पहले आधिकारिक साइट पर जाएं।'
           : 'All information is sourced from official government websites. Verify at official sources before applying.'}
      </div>

      <div className="relative mb-6">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-11" placeholder={hi ? 'योजना खोजें...' : 'Search schemes...'}
          value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">{hi ? 'लोड हो रहा है...' : 'Loading...'}</div>
      ) : (
        <div className="space-y-4">
          {schemes.map(s => (
            <div key={s.id} className="card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-gray-900">{s.name}</h2>
                    {s.status === 'verified' && <span className="badge-green text-xs flex items-center gap-1"><CheckCircle size={11} />Verified</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{s.issuing_authority}</p>
                  <p className="text-sm text-gray-700">{s.summary}</p>
                </div>
              </div>

              <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className="mt-3 text-sm text-brand-600 hover:underline font-medium">
                {expanded === s.id ? '▲ ' : '▼ '}{hi ? 'विस्तार से देखें' : 'Show details'}
              </button>

              {expanded === s.id && (
                <div className="mt-4 space-y-3 text-sm border-t border-gray-100 pt-4">
                  {[
                    { label: hi ? 'पात्रता' : 'Eligibility', val: s.eligibility_conditions },
                    { label: hi ? 'लाभ' : 'Benefits', val: s.benefits },
                    { label: hi ? 'आवश्यक दस्तावेज' : 'Documents Required', val: s.documents_required },
                  ].map(row => row.val && (
                    <div key={row.label}>
                      <h3 className="font-semibold text-gray-700 mb-1">{row.label}</h3>
                      <p className="text-gray-600 leading-relaxed">{row.val}</p>
                    </div>
                  ))}
                  <a href={s.official_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 btn-primary text-sm py-2 px-4 mt-2">
                    <ExternalLink size={15} />{hi ? 'आधिकारिक वेबसाइट' : 'Official Website'}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
