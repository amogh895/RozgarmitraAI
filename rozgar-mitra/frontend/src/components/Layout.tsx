import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  const links = [
    { to: '/', label: i18n.language === 'hi' ? 'होम' : 'Home' },
    { to: '/mentor', label: i18n.language === 'hi' ? 'AI सलाहकार' : 'AI Mentor' },
    { to: '/schemes', label: i18n.language === 'hi' ? 'सरकारी योजनाएं' : 'Schemes' },
    { to: '/training', label: i18n.language === 'hi' ? 'प्रशिक्षण' : 'Training' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-xl text-brand-700 flex items-center gap-2">
            <span className="text-2xl">🎯</span> RozgarMitra AI
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`text-sm font-medium transition-colors ${loc.pathname === l.to ? 'text-brand-700 font-semibold' : 'text-gray-600 hover:text-brand-600'}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:text-brand-600 hover:border-brand-300 transition-colors">
              <Globe size={14} />{i18n.language === 'en' ? 'हिंदी' : 'English'}
            </button>
            <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="block py-2 text-gray-700 font-medium text-sm">{l.label}</Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="bg-gray-900 text-gray-400 text-sm py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-1">
          <div className="text-white font-bold">🎯 RozgarMitra AI</div>
          <div>Powered by IBM Granite on IBM watsonx.ai</div>
          <div className="text-xs text-gray-500 pt-1">
            Scheme information is sourced from official government websites. Always verify at official sources before applying.
          </div>
        </div>
      </footer>
    </div>
  );
}
