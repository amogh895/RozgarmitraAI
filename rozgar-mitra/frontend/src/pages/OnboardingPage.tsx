import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usersApi } from '@/api';
import toast from 'react-hot-toast';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

const SKILL_SUGGESTIONS = ['Masonry','Plastering','Electrical Wiring','Plumbing','Carpentry','Welding','Painting','Tailoring','Driving','Cooking','Farming','Delivery','Security','Tiling','AC Repair','Mobile Repair','Beautician'];
const CATEGORIES = ['Construction','Electrical','Plumbing','Carpentry','Welding','Painting','Tailoring','Driving','Delivery','Agriculture','Hospitality','Security','Handicraft','Electronics','Beauty & Wellness','Logistics'];
const EDUCATION_LEVELS = [
  { value: 'none', label: 'No formal education' },
  { value: 'primary', label: 'Primary (up to 5th)' },
  { value: 'secondary', label: 'Secondary (up to 10th)' },
  { value: 'higher_secondary', label: 'Higher Secondary (12th)' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'vocational', label: 'Vocational/ITI' },
];

export default function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    skills: [] as string[],
    work_categories: [] as string[],
    experience_years: 0,
    expected_wage: 0,
    wage_unit: 'daily' as 'daily'|'hourly'|'monthly',
    availability: 'immediate',
    education_level: 'none',
    district: '',
    state: '',
    training_interests: [] as string[],
  });

  const toggleItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const handleSave = async (skip = false) => {
    if (skip) { navigate('/dashboard'); return; }
    setLoading(true);
    try {
      await usersApi.updateWorkerProfile(form);
      toast.success('Profile saved!');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{t('onboarding.title')}</h1>
          <span className="text-sm text-gray-500">Step {step} of {TOTAL_STEPS}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-2 bg-brand-600 rounded-full transition-all" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>

      <div className="card space-y-6">
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold">{t('onboarding.skills')}</h2>
            <div className="flex flex-wrap gap-2">
              {SKILL_SUGGESTIONS.map(s => (
                <button key={s} type="button" onClick={() => setForm({ ...form, skills: toggleItem(form.skills, s) })}
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${form.skills.includes(s) ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
                  {form.skills.includes(s) && <Check size={12} className="inline mr-1" />}{s}
                </button>
              ))}
            </div>
            <div>
              <label className="label">Location (optional)</label>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="District" className="input" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} />
                <input type="text" placeholder="State" className="input" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold">{t('onboarding.categories')}</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, work_categories: toggleItem(form.work_categories, c) })}
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${form.work_categories.includes(c) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div>
              <label className="label">{t('onboarding.education')}</label>
              <select className="input" value={form.education_level} onChange={e => setForm({ ...form, education_level: e.target.value })}>
                {EDUCATION_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold">{t('onboarding.experience')} & {t('onboarding.wage')}</h2>
            <div>
              <label className="label">{t('onboarding.experience')}</label>
              <input type="number" min={0} max={60} className="input" value={form.experience_years}
                onChange={e => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="label">{t('onboarding.wage')} (₹)</label>
              <div className="flex gap-3">
                <input type="number" min={0} className="input flex-1" placeholder="Amount" value={form.expected_wage || ''}
                  onChange={e => setForm({ ...form, expected_wage: parseFloat(e.target.value) || 0 })} />
                <select className="input w-36" value={form.wage_unit} onChange={e => setForm({ ...form, wage_unit: e.target.value as any })}>
                  <option value="hourly">Per Hour</option>
                  <option value="daily">Per Day</option>
                  <option value="monthly">Per Month</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">{t('onboarding.availability')}</label>
              <select className="input" value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })}>
                <option value="immediate">Immediate</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-lg font-semibold">{t('onboarding.interests')}</h2>
            <p className="text-sm text-gray-500">Select areas you'd like to learn more about (optional)</p>
            <div className="flex flex-wrap gap-2">
              {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).map(s => (
                <button key={s} type="button" onClick={() => setForm({ ...form, training_interests: toggleItem(form.training_interests, s) })}
                  className={`px-4 py-2 rounded-full border-2 text-sm transition-all ${form.training_interests.includes(s) ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        {step > 1 ? (
          <button className="btn-outline flex items-center gap-2" onClick={() => setStep(step - 1)}>
            <ChevronLeft size={18} />{t('onboarding.back')}
          </button>
        ) : (
          <button className="text-gray-400 text-sm" onClick={() => handleSave(true)}>{t('onboarding.skip')}</button>
        )}
        {step < TOTAL_STEPS ? (
          <button className="btn-primary flex items-center gap-2" onClick={() => setStep(step + 1)}>
            {t('onboarding.next')}<ChevronRight size={18} />
          </button>
        ) : (
          <button className="btn-primary" onClick={() => handleSave(false)} disabled={loading}>
            {loading ? t('common.loading') : t('onboarding.save')}
          </button>
        )}
      </div>
    </div>
  );
}
