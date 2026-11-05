import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const en = {
  // Nav
  nav: { home: 'Home', jobs: 'Find Jobs', mentor: 'AI Mentor', schemes: 'Schemes', training: 'Training', login: 'Login', register: 'Register', dashboard: 'Dashboard', logout: 'Logout' },
  // Auth
  auth: { login: 'Sign In', register: 'Create Account', email: 'Email', password: 'Password', fullName: 'Full Name', role: 'I am a', worker: 'Worker', employer: 'Employer', forgotPassword: 'Forgot password?', noAccount: "Don't have an account?", hasAccount: 'Already have an account?' },
  // Onboarding
  onboarding: { title: 'Complete Your Profile', skills: 'Your Skills', categories: 'Work Categories', experience: 'Years of Experience', wage: 'Expected Wage', wageUnit: 'Wage Period', availability: 'Availability', education: 'Education Level', interests: 'Training Interests', next: 'Next', back: 'Back', save: 'Save Profile', skip: 'Skip for now' },
  // Jobs
  jobs: { title: 'Find Jobs', search: 'Search jobs...', filter: 'Filter', apply: 'Apply Now', save: 'Save Job', saved: 'Saved', matchScore: 'Match Score', applyModal: 'Apply for this job', coverNote: 'Cover Note (optional)', submitApplication: 'Submit Application', demo: 'DEMO', noJobs: 'No jobs found. Try different filters.' },
  // Mentor
  mentor: { title: 'AI Career Mentor', subtitle: 'Powered by IBM Granite on watsonx.ai', placeholder: 'Ask me anything about your career...', send: 'Send', unavailable: 'AI mentor is currently unavailable. Other features work normally.', disclaimer: 'AI responses are for guidance only. Verify important details at official sources.' },
  // Schemes
  schemes: { title: 'Government Schemes', checkEligibility: 'Check Eligibility', officialSite: 'Official Website', unverified: 'UNVERIFIED – Details may be outdated', disclaimer: 'This is a preliminary check only. Verify at official government websites.' },
  // Training
  training: { title: 'Training & Skills', enroll: 'Enroll', enrolled: 'Enrolled', free: 'Free', duration: 'Duration', provider: 'Provider', mode: 'Mode' },
  // Dashboard
  dashboard: { welcome: 'Welcome back,', recommended: 'Recommended Jobs', saved: 'Saved Jobs', applications: 'My Applications', roadmap: 'Career Roadmap', editProfile: 'Edit Profile' },
  // Common
  common: { loading: 'Loading...', error: 'Something went wrong', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', view: 'View', close: 'Close', back: 'Back', next: 'Next', submit: 'Submit', required: 'Required', optional: 'Optional' },
};

const hi = {
  nav: { home: 'होम', jobs: 'नौकरी खोजें', mentor: 'AI सलाहकार', schemes: 'सरकारी योजनाएं', training: 'प्रशिक्षण', login: 'लॉग इन', register: 'रजिस्टर', dashboard: 'डैशबोर्ड', logout: 'लॉग आउट' },
  auth: { login: 'साइन इन करें', register: 'खाता बनाएं', email: 'ईमेल', password: 'पासवर्ड', fullName: 'पूरा नाम', role: 'मैं हूं', worker: 'कामगार', employer: 'नियोक्ता', forgotPassword: 'पासवर्ड भूल गए?', noAccount: 'खाता नहीं है?', hasAccount: 'पहले से खाता है?' },
  onboarding: { title: 'अपनी प्रोफ़ाइल पूरी करें', skills: 'आपके कौशल', categories: 'काम की श्रेणी', experience: 'अनुभव (वर्षों में)', wage: 'अपेक्षित वेतन', wageUnit: 'वेतन अवधि', availability: 'उपलब्धता', education: 'शिक्षा स्तर', interests: 'प्रशिक्षण रुचि', next: 'आगे', back: 'पीछे', save: 'प्रोफ़ाइल सहेजें', skip: 'अभी छोड़ें' },
  jobs: { title: 'नौकरी खोजें', search: 'नौकरी खोजें...', filter: 'फ़िल्टर', apply: 'अभी आवेदन करें', save: 'सहेजें', saved: 'सहेजी गई', matchScore: 'मिलान स्कोर', applyModal: 'इस नौकरी के लिए आवेदन', coverNote: 'कवर नोट (वैकल्पिक)', submitApplication: 'आवेदन करें', demo: 'डेमो', noJobs: 'कोई नौकरी नहीं मिली। अलग फ़िल्टर आजमाएं।' },
  mentor: { title: 'AI करियर सलाहकार', subtitle: 'IBM Granite द्वारा संचालित', placeholder: 'अपने करियर के बारे में कुछ भी पूछें...', send: 'भेजें', unavailable: 'AI सेवा अभी उपलब्ध नहीं है। अन्य सुविधाएं काम कर रही हैं।', disclaimer: 'AI जवाब केवल मार्गदर्शन के लिए हैं। महत्वपूर्ण जानकारी आधिकारिक स्रोतों से सत्यापित करें।' },
  schemes: { title: 'सरकारी योजनाएं', checkEligibility: 'पात्रता जांचें', officialSite: 'आधिकारिक वेबसाइट', unverified: 'असत्यापित – जानकारी पुरानी हो सकती है', disclaimer: 'यह केवल प्रारंभिक जांच है। आधिकारिक सरकारी वेबसाइट पर सत्यापित करें।' },
  training: { title: 'प्रशिक्षण और कौशल', enroll: 'नामांकन करें', enrolled: 'नामांकित', free: 'निःशुल्क', duration: 'अवधि', provider: 'प्रदाता', mode: 'माध्यम' },
  dashboard: { welcome: 'स्वागत है,', recommended: 'अनुशंसित नौकरियां', saved: 'सहेजी गई नौकरियां', applications: 'मेरे आवेदन', roadmap: 'करियर रोडमैप', editProfile: 'प्रोफ़ाइल संपादित करें' },
  common: { loading: 'लोड हो रहा है...', error: 'कुछ गलत हो गया', save: 'सहेजें', cancel: 'रद्द करें', delete: 'हटाएं', edit: 'संपादित करें', view: 'देखें', close: 'बंद करें', back: 'पीछे', next: 'आगे', submit: 'जमा करें', required: 'आवश्यक', optional: 'वैकल्पिक' },
};

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hi: { translation: hi } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
