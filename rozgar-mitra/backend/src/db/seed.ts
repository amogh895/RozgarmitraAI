// Seed script — real knowledge base only.
// No demo jobs. No fake data. All scheme/training records are real, sourced, and attributed.
// Run with: npm run db:seed

import { getDb } from './connection';

async function seed() {
  const db = getDb();

  // ── Clear old demo/fake data ───────────────────────────────────────────────
  db.exec(`DELETE FROM government_schemes`);
  db.exec(`DELETE FROM training_courses`);
  // Keep jobs table empty — no fake listings

  // ── Real Government Schemes (sourced from official .gov.in websites) ───────
  const schemes = [
    {
      name: 'PM Vishwakarma Yojana',
      issuing_authority: 'Ministry of Micro, Small & Medium Enterprises, Government of India',
      summary: 'A Central Sector Scheme to support traditional artisans and craftspeople (Vishwakarmas) working with hands and tools in 18 traditional trades. Provides recognition, skill training, modern toolkit support, and collateral-free credit.',
      eligibility_conditions: 'Artisans/craftspeople working in one of 18 traditional trades (carpenter, blacksmith, goldsmith, potter, sculptor, cobbler, mason, weaver, tailor, fisherman, etc.). Must be 18+ years. Should not have availed PMEGP/PM SVANidhi/Mudra loans in the last 5 years. Only one member per family.',
      documents_required: 'Aadhaar card linked to mobile, ration card or family identity proof, bank account details, caste certificate if applicable',
      benefits: 'PM Vishwakarma certificate and ID card; Basic skill training (5–7 days) with ₹500/day stipend; Advanced skill training (15 days) with ₹500/day stipend; Toolkit incentive up to ₹15,000; Collateral-free credit: ₹1 lakh (1st tranche), ₹2 lakh (2nd tranche) at 5% concessional interest; Digital transaction incentive; Marketing support',
      geographic_coverage: 'National — all states and union territories of India',
      official_url: 'https://pmvishwakarma.gov.in',
      status: 'verified',
      last_verified_date: '2024-01-15',
    },
    {
      name: 'PM Shram Yogi Maandhan (PM-SYM)',
      issuing_authority: 'Ministry of Labour & Employment, Government of India',
      summary: 'Voluntary and contributory pension scheme for unorganised sector workers to ensure old age protection. Workers and the Central Government each contribute 50% of the monthly premium.',
      eligibility_conditions: 'Unorganised sector worker; Age 18–40 years; Monthly income ≤ ₹15,000; Must not be covered under NPS, ESIC, or EPFO; Must not be an income tax payer',
      documents_required: 'Aadhaar card, savings bank account or Jan Dhan account, active mobile number',
      benefits: 'Monthly pension of ₹3,000 after attaining age of 60 years; Family pension (50% of ₹3,000 = ₹1,500) to spouse on death of worker',
      geographic_coverage: 'National — all states and union territories of India',
      official_url: 'https://maandhan.in/shramyogi',
      status: 'verified',
      last_verified_date: '2024-01-15',
    },
    {
      name: 'e-Shram Portal — Unorganised Worker Registration',
      issuing_authority: 'Ministry of Labour & Employment, Government of India',
      summary: 'National database of unorganised workers. Registration provides a Unique Shramik Identification Number (USID) card and access to linked social security schemes.',
      eligibility_conditions: 'Unorganised sector worker aged 16–59 years. Must not be a member of EPFO or ESIC.',
      documents_required: 'Aadhaar card linked to an active mobile number; active bank account',
      benefits: 'e-Shram card (USID); Accidental insurance cover of ₹2 lakh under PMSBY; Gateway to PM-SYM, PM-SBRY, and other social security schemes',
      geographic_coverage: 'National — all states and union territories of India',
      official_url: 'https://eshram.gov.in',
      status: 'verified',
      last_verified_date: '2024-01-15',
    },
    {
      name: 'PM SVANidhi — PM Street Vendor\'s AtmaNirbhar Nidhi',
      issuing_authority: 'Ministry of Housing & Urban Affairs, Government of India',
      summary: 'Micro-credit scheme for street vendors to restart livelihoods. Provides working capital loans with interest subsidy and rewards digital transactions.',
      eligibility_conditions: 'Street vendor with certificate of vending (CoV) issued by urban local body (ULB), or letter of recommendation from ULB/TVC, or identity card issued by ULB; Must be engaged in street vending in urban area',
      documents_required: 'Aadhaar card linked to mobile, vending certificate or ULB letter of recommendation, bank account',
      benefits: '1st loan: ₹10,000; 2nd loan: ₹20,000; 3rd loan: ₹50,000 — all at 7% p.a. interest subsidy; Cash-back incentive for digital transactions; Credit score building',
      geographic_coverage: 'Urban areas across India',
      official_url: 'https://pmsvanidhi.mohua.gov.in',
      status: 'verified',
      last_verified_date: '2024-01-15',
    },
    {
      name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)',
      issuing_authority: 'Ministry of Skill Development and Entrepreneurship, Government of India',
      summary: 'Flagship skill development scheme offering short-term training (STT) and Recognition of Prior Learning (RPL) to youth and workers, leading to industry-recognised certification.',
      eligibility_conditions: 'Indian citizen; School/college dropout or unemployed/underemployed youth. RPL open to workers with prior experience. Age and education criteria vary by sector and job role.',
      documents_required: 'Aadhaar card, bank account, education certificates (for STT); Prior experience documentation (for RPL)',
      benefits: 'Free skill training at PMKVY training centres; Industry-recognised National Skills Qualification Framework (NSQF) certificate; Post-placement support; Monetary reward upon certification (amount varies by sector)',
      geographic_coverage: 'National — training centres across all states',
      official_url: 'https://www.pmkvyofficial.org',
      status: 'verified',
      last_verified_date: '2024-01-15',
    },
  ];

  const insertScheme = db.prepare(`
    INSERT INTO government_schemes
      (name, issuing_authority, summary, eligibility_conditions, documents_required,
       benefits, geographic_coverage, official_url, last_verified_date, status)
    VALUES
      (@name, @issuing_authority, @summary, @eligibility_conditions, @documents_required,
       @benefits, @geographic_coverage, @official_url, @last_verified_date, @status)
  `);
  for (const s of schemes) insertScheme.run(s);

  // ── Real Training Courses (official government training programmes) ────────
  const courses = [
    {
      provider: 'Skill India / PMKVY Training Centres (National Skill Development Corporation)',
      title: 'Short-Term Skill Training under PMKVY 4.0',
      category: 'Multi-sector',
      duration_hours: 150,
      mode: 'offline',
      eligibility: 'School/college dropouts, unemployed youth. Age criteria vary by sector.',
      cost_inr: 0,
      location: 'Training centres across India. Find nearest: https://www.skillindia.gov.in/training-centres',
      official_url: 'https://www.pmkvyofficial.org',
      skills_taught: JSON.stringify(['Varies by trade: Construction, Electrical, Plumbing, IT, Retail, Hospitality, Beauty, Automotive and more']),
      status: 'verified',
    },
    {
      provider: 'National Skill Development Corporation (NSDC)',
      title: 'Skill India Digital — Free Online Courses',
      category: 'Digital Skills',
      duration_hours: 20,
      mode: 'online',
      eligibility: 'Any Indian citizen. No minimum education required.',
      cost_inr: 0,
      location: 'Online — accessible from any smartphone or computer',
      official_url: 'https://skillindiadigital.gov.in',
      skills_taught: JSON.stringify(['Digital literacy', 'Mobile payments', 'Internet basics', 'Online safety', 'Financial literacy']),
      status: 'verified',
    },
    {
      provider: 'Ministry of Skill Development and Entrepreneurship',
      title: 'Recognition of Prior Learning (RPL) — PMKVY',
      category: 'Multi-sector',
      duration_hours: 32,
      mode: 'offline',
      eligibility: 'Workers with existing skills and work experience in any sector. No formal education required.',
      cost_inr: 0,
      location: 'RPL camps organised at workplaces, industry clusters, gram panchayats. Check: https://www.pmkvyofficial.org/rpl',
      official_url: 'https://www.pmkvyofficial.org/rpl',
      skills_taught: JSON.stringify(['Formal recognition of existing skills in masonry, carpentry, electrical, plumbing, tailoring, beauty, agriculture, and 30+ other sectors']),
      status: 'verified',
    },
  ];

  const insertCourse = db.prepare(`
    INSERT INTO training_courses
      (provider, title, category, duration_hours, mode, eligibility, cost_inr,
       location, official_url, skills_taught, status)
    VALUES
      (@provider, @title, @category, @duration_hours, @mode, @eligibility, @cost_inr,
       @location, @official_url, @skills_taught, @status)
  `);
  for (const c of courses) insertCourse.run(c);

  console.log('✅ Real knowledge base seeded:');
  console.log(`   ${schemes.length} verified government schemes`);
  console.log(`   ${courses.length} verified training programmes`);
  console.log('   0 demo jobs (none needed)');
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
