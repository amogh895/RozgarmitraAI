import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bot, FileCheck, BookOpen, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { i18n } = useTranslation();
  const hi = i18n.language === 'hi';

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-teal-600 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            🤖 {hi ? 'IBM Granite द्वारा संचालित' : 'Powered by IBM Granite on watsonx.ai'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            🎯 RozgarMitra AI
          </h1>
          <p className="text-xl text-white/90 mb-3 font-semibold">
            {hi ? 'अनौपचारिक कामगारों के लिए AI करियर सलाहकार' : 'AI Career Mentor for Informal Workers'}
          </p>
          <p className="text-white/75 text-base mb-8 max-w-xl mx-auto">
            {hi
              ? 'करियर मार्गदर्शन, सरकारी योजनाएं और कौशल प्रशिक्षण — हिंदी और अंग्रेजी में।'
              : 'Career guidance, government schemes, and skill training — in Hindi and English.'}
          </p>
          <Link to="/mentor" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors text-base">
            {hi ? 'AI सलाहकार से बात करें' : 'Chat with AI Mentor'} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            {hi ? 'क्या मिलेगा आपको?' : 'What RozgarMitra Offers'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                to: '/mentor', icon: <Bot size={28} />, color: 'text-brand-600 bg-brand-50',
                title: hi ? 'AI करियर सलाहकार' : 'AI Career Mentor',
                desc: hi ? 'IBM Granite AI से करियर, नौकरी, कौशल और वित्तीय सलाह पाएं।' : 'Get career, job, skill, and financial guidance powered by IBM Granite.'
              },
              {
                to: '/schemes', icon: <FileCheck size={28} />, color: 'text-green-600 bg-green-50',
                title: hi ? 'सरकारी योजनाएं' : 'Government Schemes',
                desc: hi ? 'PM Vishwakarma, e-Shram, PM-SYM जैसी आधिकारिक योजनाओं की जानकारी।' : 'Verified info on PM Vishwakarma, e-Shram, PM-SYM, PMKVY and more.'
              },
              {
                to: '/training', icon: <BookOpen size={28} />, color: 'text-teal-600 bg-teal-50',
                title: hi ? 'कौशल प्रशिक्षण' : 'Skill Training',
                desc: hi ? 'सरकारी निःशुल्क प्रशिक्षण कार्यक्रमों की जानकारी।' : 'Official free and subsidised government training programmes.'
              },
            ].map(f => (
              <Link key={f.to} to={f.to} className="card hover:shadow-md transition-shadow text-center group">
                <div className={`inline-flex p-3 rounded-xl ${f.color} mb-4`}>{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-brand-600">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
