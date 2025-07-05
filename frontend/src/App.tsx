import React, { useState } from 'react';
import { Home } from './pages/Home/Home';
import { BottomNavigation } from './components/BottomNavigation/BottomNavigation';
import './App.css';

export const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<'clothing' | 'outfits' | 'profile'>('clothing');

  return (
    <div className="app">
      <div className="app-content">
        <Home currentSection={currentSection} />
      </div>
      <BottomNavigation 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection} 
      />
    </div>
  );
};
