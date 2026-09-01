import React, { useState, useEffect } from 'react';
import { SidebarNav } from './components/SidebarNav';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { AlertFeed } from './components/AlertFeed';
import { Investigation } from './components/Investigation';
import { CaseManagement } from './components/CaseManagement';
import { AiOpsConsole } from './components/AiOpsConsole';
import { ModelIntelligence } from './components/ModelIntelligence';
import { SettingsModal } from './components/SettingsModal';
import { SupportModal } from './components/SupportModal';
import { NewCaseModal } from './components/NewCaseModal';
import { ToastNotification } from './components/ToastNotification';

export default function App() {
  const [mainNavView, setMainNavView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view')?.toUpperCase() || 'DASHBOARD';
  });

  const [selectedAccountId, setSelectedAccountId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('account') || 'ACC-8392';
  });

  const [analystUser] = useState({
    name: 'System Administrator',
    initials: 'AY',
    role: 'Lvl 4 Access'
  });

  // Modal & Toast States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  const showToast = (msg) => {
    setActiveToast(msg);
  };

  // Keep URL synchronized
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', mainNavView.toLowerCase());
    if (selectedAccountId) {
      url.searchParams.set('account', selectedAccountId);
    }
    window.history.replaceState({}, '', url.toString());
  }, [mainNavView, selectedAccountId]);

  const handleSelectAccount = (accId) => {
    setSelectedAccountId(accId);
    setMainNavView('INVESTIGATION');
  };

  const handleCreateCase = (newCase) => {
    showToast(`Case ${newCase.id} created for ${newCase.accountId}!`);
  };

  return (
    <div style={{
      display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden',
      background: '#F8FAFC', color: '#0F172A', fontFamily: 'Inter, -apple-system, sans-serif'
    }}>
      {/* Left Sidebar Navigation */}
      <SidebarNav
        mainNavView={mainNavView}
        setMainNavView={setMainNavView}
        alertCount={14}
        analystUser={analystUser}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenNewCase={() => setIsNewCaseOpen(true)}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
        {/* Top Header Bar */}
        <TopNav
          analystUser={analystUser}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToast={showToast}
        />

        {/* View Container */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          {mainNavView === 'DASHBOARD' && <Dashboard onToast={showToast} onOpenNewCase={() => setIsNewCaseOpen(true)} onNavigate={setMainNavView} />}
          {mainNavView === 'ALERT_FEED' && <AlertFeed onSelectAccount={handleSelectAccount} onToast={showToast} />}
          {mainNavView === 'INVESTIGATION' && <Investigation selectedAccountId={selectedAccountId} onToast={showToast} />}
          {mainNavView === 'CASE_MGMT' && <CaseManagement onToast={showToast} onOpenNewCase={() => setIsNewCaseOpen(true)} />}
          {mainNavView === 'AI_OPS' && <AiOpsConsole onToast={showToast} />}
          {mainNavView === 'MODEL_INTEL' && <ModelIntelligence onToast={showToast} />}
        </div>
      </div>

      {/* Modals & Notifications */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onSaveToast={showToast} />
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} onToast={showToast} />
      <NewCaseModal isOpen={isNewCaseOpen} onClose={() => setIsNewCaseOpen(false)} onCreateCase={handleCreateCase} />
      <ToastNotification toast={activeToast} onClose={() => setActiveToast(null)} />
    </div>
  );
}

