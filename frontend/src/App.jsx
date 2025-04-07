import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StatsDashboard from './components/Stats/StatsDashboard';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<StatsDashboard />} />
    </Routes>
  );
}

export default App;
