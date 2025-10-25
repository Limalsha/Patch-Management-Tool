import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { ServerManagementPage } from './components/ServerManagementPage';
import { PatchManagementPage } from './components/PatchManagementPage';
import { ApplyPatchPage } from './components/ApplyPatchPage';
import { AnomalyDetectionPage } from './components/AnomalyDetectionPage.tsx';
import { AppLayout } from './components/AppLayout';
import { Toaster } from './components/ui/sonner';

type Page = 'login' | 'dashboard' | 'servers' | 'patches' | 'apply' | 'anomaly';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleNavigate = (page: 'dashboard' | 'servers' | 'patches' | 'apply' | 'anomaly') => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <AppLayout 
        currentPage={currentPage as 'dashboard' | 'servers' | 'patches' | 'apply' | 'anomaly'} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'servers' && <ServerManagementPage />}
        {currentPage === 'patches' && <PatchManagementPage />}
        {currentPage === 'apply' && <ApplyPatchPage />}
        {currentPage === 'anomaly' && <AnomalyDetectionPage />}
      </AppLayout>
      <Toaster />
    </>
  );
}
