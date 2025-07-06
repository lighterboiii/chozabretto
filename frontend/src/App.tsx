import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home/Home';
import { BottomNavigation } from './components/BottomNavigation/BottomNavigation';
import { TelegramProvider, useTelegramContext } from './contexts/TelegramContext';
import './App.css';

const AppContent: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<'clothing' | 'outfits' | 'profile'>('clothing');
  const { isAvailable, themeParams, setHeaderColor, setBackgroundColor, hapticSelection } = useTelegramContext();

  useEffect(() => {
    if (isAvailable) {
      try {
        if (themeParams.header_bg_color) {
          setHeaderColor(themeParams.header_bg_color);
        }
        if (themeParams.bg_color) {
          setBackgroundColor(themeParams.bg_color);
        }
      } catch (error) {
        console.log('Color setting not supported in this version');
      }
    }
  }, [isAvailable, themeParams, setHeaderColor, setBackgroundColor]);

  const handleSectionChange = (section: 'clothing' | 'outfits' | 'profile') => {
    setCurrentSection(section);
    hapticSelection();
  };

  return (
    <div className="app">
      <div className="app-content">
        <Home currentSection={currentSection} />
      </div>
      <BottomNavigation 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange} 
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TelegramProvider>
      <AppContent />
    </TelegramProvider>
  );
};
