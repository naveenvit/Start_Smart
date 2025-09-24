import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Ideas } from './pages/Ideas';
import { AIChat } from './pages/AIChat';
import { BMCGenerator } from './pages/BMCGenerator';
import { PitchCoach } from './pages/PitchCoach';
import { MicroFunding } from './pages/MicroFunding';
import { Recruitment } from './pages/Recruitment';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/mentor" element={<AIChat />} />
          <Route path="/bmc" element={<BMCGenerator />} />
          <Route path="/pitch" element={<PitchCoach />} />
          <Route path="/funding" element={<MicroFunding />} />
          <Route path="/recruitment" element={<Recruitment />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
