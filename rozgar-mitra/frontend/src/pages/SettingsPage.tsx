import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '@/api';
import toast from 'react-hot-toast';
import { Globe, Trash2, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user, logout, setLanguage } = useAuthStore();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLanguageChange = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    toast.success(lang === 'hi' ? 'भाषा बदली गई' : 'Language changed to English');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await usersApi.deleteAccount();
      logout();
      navigate('/');
      toast.success('Account deleted.');
    } catch {
      toast.error('Failed to delete account.');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile info */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-3">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{user?.full_name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{user?.email}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="font-medium capitalize">{user?.role}</span></div>
        </div>
      </div>

      {/* Language */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Globe size={18} />Language Preference</h2>
        <div className="grid grid-cols-2 gap-3">
          {(['en', 'hi'] as const).map(lang => (
            <button key={lang} onClick={() => handleLanguageChange(lang)}
              className={`py-4 rounded-xl border-2 font-semibold text-sm transition-all ${i18n.language === lang ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
              {lang === 'en' ? '🇬🇧 English' : '🇮🇳 हिंदी'}
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-3">Session</h2>
        <button onClick={() => { logout(); navigate('/'); }} className="btn-outline flex items-center gap-2 text-sm">
          <LogOut size={16} />{t('nav.logout')}
        </button>
      </div>

      {/* Danger zone */}
      <div className="card border-red-200">
        <h2 className="font-bold text-red-700 mb-1">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">Deleting your account is permanent and cannot be undone.</p>
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} className="btn-outline text-red-600 border-red-300 flex items-center gap-2 text-sm">
            <Trash2 size={16} />Delete My Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-700 font-semibold">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-outline flex-1 text-sm">{t('common.cancel')}</button>
              <button onClick={handleDeleteAccount} disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-xl text-sm transition-colors disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
