// Database migration runner
// Run with: npm run db:migrate
import { getDb } from './connection';

const SCHEMA_SQL = `
-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  email             TEXT    NOT NULL UNIQUE,
  password_hash     TEXT    NOT NULL,
  role              TEXT    NOT NULL CHECK(role IN ('worker','employer','admin')),
  full_name         TEXT    NOT NULL,
  preferred_language TEXT   NOT NULL DEFAULT 'en' CHECK(preferred_language IN ('en','hi')),
  is_active         INTEGER NOT NULL DEFAULT 1,
  created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── Worker Profiles ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS worker_profiles (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id             INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  district            TEXT,
  state               TEXT,
  skills              TEXT    NOT NULL DEFAULT '[]',
  work_categories     TEXT    NOT NULL DEFAULT '[]',
  experience_years    INTEGER NOT NULL DEFAULT 0,
  expected_wage       REAL    NOT NULL DEFAULT 0,
  wage_unit           TEXT    NOT NULL DEFAULT 'daily' CHECK(wage_unit IN ('hourly','daily','monthly')),
  availability        TEXT    NOT NULL DEFAULT 'flexible',
  education_level     TEXT    NOT NULL DEFAULT 'none'
                      CHECK(education_level IN ('none','primary','secondary','higher_secondary','graduate','vocational')),
  training_interests  TEXT    NOT NULL DEFAULT '[]',
  onboarding_complete INTEGER NOT NULL DEFAULT 0,
  created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── Employer Profiles ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employer_profiles (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name    TEXT    NOT NULL,
  industry        TEXT    NOT NULL DEFAULT '',
  district        TEXT,
  state           TEXT,
  contact_phone   TEXT,
  is_verified     INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── Jobs ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  employer_id         INTEGER NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  title               TEXT    NOT NULL,
  category            TEXT    NOT NULL,
  location_district   TEXT    NOT NULL,
  location_state      TEXT    NOT NULL,
  wage_min            REAL    NOT NULL DEFAULT 0,
  wage_max            REAL    NOT NULL DEFAULT 0,
  wage_unit           TEXT    NOT NULL DEFAULT 'daily' CHECK(wage_unit IN ('hourly','daily','monthly')),
  employment_type     TEXT    NOT NULL DEFAULT 'full_time'
                      CHECK(employment_type IN ('full_time','part_time','contract','daily_wage','gig')),
  required_skills     TEXT    NOT NULL DEFAULT '[]',
  description         TEXT    NOT NULL DEFAULT '',
  application_method  TEXT    NOT NULL DEFAULT 'apply_online',
  posted_date         TEXT    NOT NULL DEFAULT (date('now')),
  expiry_date         TEXT    NOT NULL DEFAULT (date('now','+30 days')),
  status              TEXT    NOT NULL DEFAULT 'pending'
                      CHECK(status IN ('draft','pending','active','closed','rejected')),
  is_demo             INTEGER NOT NULL DEFAULT 0,
  created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_jobs_status    ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category  ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_state     ON jobs(location_state);
CREATE INDEX IF NOT EXISTS idx_jobs_employer  ON jobs(employer_id);

-- ─── Job Applications ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_applications (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id      INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id   INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  status      TEXT    NOT NULL DEFAULT 'applied'
              CHECK(status IN ('applied','viewed','shortlisted','rejected','hired')),
  cover_note  TEXT,
  applied_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(job_id, worker_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_worker ON job_applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_applications_job    ON job_applications(job_id);

-- ─── Saved Jobs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_jobs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  worker_id   INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  job_id      INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(worker_id, job_id)
);

-- ─── Government Schemes ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS government_schemes (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  name                  TEXT    NOT NULL,
  issuing_authority     TEXT    NOT NULL,
  summary               TEXT    NOT NULL,
  eligibility_conditions TEXT   NOT NULL DEFAULT '',
  documents_required    TEXT    NOT NULL DEFAULT '',
  benefits              TEXT    NOT NULL DEFAULT '',
  geographic_coverage   TEXT    NOT NULL DEFAULT 'National',
  official_url          TEXT    NOT NULL DEFAULT '',
  last_verified_date    TEXT    NOT NULL DEFAULT (date('now')),
  status                TEXT    NOT NULL DEFAULT 'unverified'
                        CHECK(status IN ('unverified','verified','discontinued')),
  created_at            TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── Training Courses ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS training_courses (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  provider        TEXT    NOT NULL,
  title           TEXT    NOT NULL,
  category        TEXT    NOT NULL,
  duration_hours  INTEGER NOT NULL DEFAULT 0,
  mode            TEXT    NOT NULL DEFAULT 'offline' CHECK(mode IN ('online','offline','hybrid')),
  eligibility     TEXT    NOT NULL DEFAULT '',
  cost_inr        REAL    NOT NULL DEFAULT 0,
  location        TEXT,
  official_url    TEXT    NOT NULL DEFAULT '',
  skills_taught   TEXT    NOT NULL DEFAULT '[]',
  status          TEXT    NOT NULL DEFAULT 'unverified'
                  CHECK(status IN ('unverified','verified','discontinued')),
  created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── Training Progress ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS training_progress (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  worker_id   INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  course_id   INTEGER NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  status      TEXT    NOT NULL DEFAULT 'enrolled'
              CHECK(status IN ('enrolled','in_progress','completed','dropped')),
  started_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(worker_id, course_id)
);

-- ─── Chat Sessions ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  worker_id   INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  title       TEXT    NOT NULL DEFAULT 'Career Chat',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── Chat Messages ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role        TEXT    NOT NULL CHECK(role IN ('user','assistant','system')),
  content     TEXT    NOT NULL,
  sources     TEXT    NOT NULL DEFAULT '[]',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_session ON chat_messages(session_id);

-- ─── Audit Logs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id    INTEGER,
  actor_role  TEXT,
  action      TEXT    NOT NULL,
  entity_type TEXT,
  entity_id   INTEGER,
  details     TEXT,
  ip_address  TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_actor  ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
`;

async function migrate() {
  const db = getDb();
  db.exec(SCHEMA_SQL);
  console.log('✅ Database migration complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
