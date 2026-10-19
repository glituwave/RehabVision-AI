/**
 * Authentication Modal: Role selection, demo 1-click logins, and validated form
 */

import React, { useState } from 'react';
import { X, User, Stethoscope, ShieldCheck, Lock, Mail, ArrowRight, Info } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { DEFAULT_PATIENT_USER, DEFAULT_THERAPIST_USER } from '../../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: UserProfile) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialRole = 'patient'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [condition, setCondition] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register' && !name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid clinical or personal email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const customProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (selectedRole === 'patient' ? 'Patient User' : 'Therapist User'),
      email,
      role: selectedRole,
      condition: condition || (selectedRole === 'patient' ? 'Physical Therapy Program' : 'Licensed Clinician'),
      targetSessionsPerWeek: selectedRole === 'patient' ? 4 : 0,
      streakDays: 1
    };

    onLogin(customProfile);
    onClose();
  };

  const handleDemoLogin = (role: UserRole) => {
    if (role === 'patient') {
      onLogin(DEFAULT_PATIENT_USER);
    } else {
      onLogin(DEFAULT_THERAPIST_USER);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === 'login' ? 'Sign In to RehabVision AI' : 'Create Rehabilitation Account'}
            </h2>
            <p className="text-xs text-slate-500">
              Biomechanical motion tracking & clinical oversight
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Demo 1-Click Sandbox Fast Track */}
          <div className="p-4 bg-teal-50/60 border border-teal-200/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Instant Demo Access (No Password Required)
              </span>
            </div>
            <p className="text-xs text-teal-900/80 leading-relaxed">
              Explore the full system immediately with pre-loaded clinical sessions and telemetry. Select a prototype persona:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLogin('patient')}
                className="flex items-center gap-2.5 p-2.5 bg-white hover:bg-teal-50/50 text-slate-800 border border-teal-200 rounded-lg text-left shadow-xs hover:border-teal-400 transition-all text-xs group"
              >
                <div className="w-7 h-7 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Sarah Jenkins</p>
                  <p className="text-[11px] text-slate-500">ACL Patient (Week 6)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('therapist')}
                className="flex items-center gap-2.5 p-2.5 bg-white hover:bg-teal-50/50 text-slate-800 border border-teal-200 rounded-lg text-left shadow-xs hover:border-teal-400 transition-all text-xs group"
              >
                <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Dr. Michael Chen</p>
                  <p className="text-[11px] text-slate-500">PT, DPT Clinician</p>
                </div>
              </button>
            </div>
          </div>

          {/* Role Tabs for Custom Form */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Account Type</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedRole('patient')}
                className={`py-2 px-3 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                  selectedRole === 'patient'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Patient
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('therapist')}
                className={`py-2 px-3 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                  selectedRole === 'therapist'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Physical Therapist
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedRole === 'patient' ? 'e.g. John Miller' : 'e.g. Dr. Laura Adams, PT'}
                    className="w-full pl-3 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-3 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {selectedRole === 'patient' ? 'Condition or Target Joint' : 'Clinical Specialization / Clinic'}
                </label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder={selectedRole === 'patient' ? 'e.g. Left Shoulder Impingement' : 'e.g. Orthopedic Sports Medicine'}
                  className="w-full pl-3 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
              }}
              className="text-xs text-slate-500 hover:text-teal-700 font-medium"
            >
              {mode === 'login'
                ? "Don't have an account yet? Register here"
                : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Prototype Disclosure Notice */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 leading-normal flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Prototype Note:</strong> This platform stores session data in your browser session storage for testing. It does not transmit patient health records to a remote medical server without your explicit clinic consent.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
