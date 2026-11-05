import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'worker' as 'worker'|'employer', preferred_language: 'en' as 'en'|'hi', company_name: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register(form);
      const { token, user } = res.data.data;
      login(user, token);
      toast.success('Account created!');
      navigate(form.role === 'employer' ? '/employer' : '/onboarding');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎯</div>
          <h1 className="text-2xl font-bold">{t('auth.register')}</h1>
          <p className="text-gray-500 mt-1">RozgarMitra AI</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">{t('auth.fullName')}</label>
              <input type="text" className="input" required minLength={2}
                value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label className="label">{t('auth.email')}</label>
              <input type="email" className="input" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">{t('auth.password')}</label>
              <input type="password" className="input" required minLength={8}
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
            </div>

            {/* Role selector — large touch targets */}
            <div>
              <label className="label">{t('auth.role')}</label>
              <div className="grid grid-cols-2 gap-3">
                {(['worker', 'employer'] as const).map(r => (
                  <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                    className={`py-4 rounded-xl border-2 font-semibold text-sm transition-all ${form.role === r ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
                    {r === 'worker' ? '👷 ' + t('auth.worker') : '🏢 ' + t('auth.employer')}
                  </button>
                ))}
              </div>
            </div>

            {form.role === 'employer' && (
              <div>
                <label className="label">Company Name</label>
                <input type="text" className="input" value={form.company_name}
                  onChange={e => setForm({ ...form, company_name: e.target.value })} />
              </div>
            )}

            {/* Language preference */}
            <div>
              <label className="label">Preferred Language</label>
              <div className="grid grid-cols-2 gap-3">
                {(['en', 'hi'] as const).map(l => (
                  <button key={l} type="button" onClick={() => setForm({ ...form, preferred_language: l })}
                    className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${form.preferred_language === l ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
                    {l === 'en' ? '🇬🇧 English' : '🇮🇳 हिंदी'}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? t('common.loading') : t('auth.register')}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-5">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  );
}
