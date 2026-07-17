import React from 'react';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import type { TabType } from '../../types';
import { LayoutDashboard, Smartphone, Shield, Settings } from 'lucide-react';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'features', label: 'Studio', icon: Smartphone },
  { id: 'permissions', label: 'Permissions', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const { triggerHaptic } = useHaptics();

  const handleTabSelect = (tab: TabType) => {
    if (activeTab !== tab) {
      triggerHaptic('light');
      setActiveTab(tab);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass-panel border-t border-slate-200/80 dark:border-slate-800/80 pb-safe transition-colors duration-300">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabSelect(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {/* Active Tab Floating Pill Background */}
              {isActive && (
                <span className="absolute top-1 w-12 h-8 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl transition-all duration-300" />
              )}
              
              <Icon className={`w-5 h-5 z-10 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[11px] mt-1 z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
