/**
 * Main Navbar component with role toggle, brand mark, and navigation links.
 */

import React, { useState } from 'react';
import { 
  Activity, 
  Dumbbell, 
  BarChart2, 
  UserCheck, 
  Settings, 
  Play, 
  Menu, 
  X,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentUser: UserProfile;
  onSwitchRole: (role: 'patient' | 'therapist') => void;
  onOpenAuth: () => void;
  onQuickStart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  currentUser,
  onSwitchRole,
  onOpenAuth,
  onQuickStart
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Overview' },
    { id: 'dashboard', label: currentUser.role === 'therapist' ? 'Clinician Portal' : 'Patient Hub' },
    { id: 'exercises', label: 'Exercise Library' },
    { id: 'reports', label: 'Progress Reports' },
    { id: 'therapist', label: 'Therapist Oversight' },
    { id: 'settings', label: 'Settings' }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">RehabVision</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">AI</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Smart Rehabilitation & Biometrics</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-teal-700 bg-teal-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Hub */}
          <div className="hidden md:flex items-center gap-3">
            {/* Role Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => onSwitchRole('patient')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentUser.role === 'patient'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => onSwitchRole('therapist')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentUser.role === 'therapist'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Therapist
              </button>
            </div>

            {/* Live Session Quick CTA */}
            <button
              onClick={onQuickStart}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Session</span>
            </button>

            {/* Profile Avatar / Trigger */}
            <button
              onClick={onOpenAuth}
              title="Switch user or view account"
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                {currentUser.name.charAt(0)}
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onQuickStart}
              className="px-2.5 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Session</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500 capitalize">{currentUser.role} Account</p>
            </div>
            <div className="flex gap-1 text-xs">
              <button
                onClick={() => onSwitchRole('patient')}
                className={`px-2 py-1 rounded ${currentUser.role === 'patient' ? 'bg-white shadow-xs font-bold text-teal-700' : 'text-slate-500'}`}
              >
                Patient
              </button>
              <button
                onClick={() => onSwitchRole('therapist')}
                className={`px-2 py-1 rounded ${currentUser.role === 'therapist' ? 'bg-teal-600 text-white font-bold' : 'text-slate-500'}`}
              >
                PT
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                  currentTab === link.id
                    ? 'text-teal-700 bg-teal-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg text-center"
            >
              Switch Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
