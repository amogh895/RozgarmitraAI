import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import LandingPage from '@/pages/LandingPage';
import MentorChat from '@/pages/MentorChat';
import SchemesPage from '@/pages/SchemesPage';
import TrainingPage from '@/pages/TrainingPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mentor" element={<MentorChat />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="*" element={<LandingPage />} />
      </Route>
    </Routes>
  );
}
