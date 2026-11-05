import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const { token, user } = res.data.data;
      login(user, token);
      toast.success(`Welcome back, ${user.full_name}!`);
      navigate(user.role === 'admin' ? '/admin' : user.role === 'employer' ? '/employer' : '/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎯</div>
          <h1 className="text-2xl font-bold text-gray-900">{t('auth.login')}</h1>
          <p className="text-gray-500 mt-1">RozgarMitra AI</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="email">{t('auth.email')}</label>
              <input id="email" type="email" className="input" required autoComplete="email"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="password">{t('auth.password')}</label>
              <div className="relative">
                <input id="password" type={showPwd ? 'text' : 'password'} className="input pr-12" required autoComplete="current-password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Toggle password">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? t('common.loading') : t('auth.login')}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
            <strong>Demo (local dev only):</strong><br />
            Worker: worker@demo.local / Worker@1234<br />
            Employer: employer@demo.local / Employer@1234<br />
            Admin: admin@demo.local / Admin@1234
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:underline">{t('auth.register')}</Link>
        </p>
      </div>
    </div>
  );
}
