/**
 * Settings View: Camera preferences, accessibility, profile configuration, and storage management
 */

import React, { useState } from 'react';
import { 
  Camera, 
  Volume2, 
  ShieldCheck, 
  User, 
  Trash2, 
  CheckCircle2, 
  Sliders, 
  Eye, 
  LogOut,
  Info,
  RefreshCw
} from 'lucide-react';
import { AppSettings, UserProfile } from '../../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  currentUser: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetData: () => void;
  onSwitchRole: (role: 'patient' | 'therapist') => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  currentUser,
  onUpdateProfile,
  onResetData,
  onSwitchRole,
  onLogout
}) => {
  const [name, setName] = useState(currentUser.name);
  const [condition, setCondition] = useState(currentUser.condition || '');
  const [targetSessionsPerWeek, setTargetSessionsPerWeek] = useState(currentUser.targetSessionsPerWeek || 5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...currentUser,
      name,
      condition,
      targetSessionsPerWeek
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
          <span>System & Preferences</span>
          <span aria-hidden="true">·</span>
          <span>Client-Side Local Config</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Platform Settings
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Manage camera preferences, accessibility cues, clinical profile, and local demo data storage.
        </p>
      </div>

      {/* User Profile Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">User Profile & Rehabilitation Protocol</h2>
              <p className="text-xs text-slate-500">Currently active account settings</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Role:</span>
            <span className="font-bold uppercase tracking-wider text-teal-800 px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
              {currentUser.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3 py-2 text-sm bg-slate-50 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rehabilitation Diagnosis / Target Condition
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. Right Knee ACL Reconstruction (Week 6 Post-Op)"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {currentUser.role === 'patient' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Sessions Per Week
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={targetSessionsPerWeek}
                onChange={(e) => setTargetSessionsPerWeek(Number(e.target.value))}
                className="w-32 px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Profile updated successfully
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Computer Vision & Camera Configuration */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Computer Vision & Camera Preferences</h2>
            <p className="text-xs text-slate-500">Pose landmarker overlay rendering and display</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-900">Mirror Webcam Preview</p>
              <p className="text-[11px] text-slate-500">Flips video horizontally to resemble a physical mirror</p>
            </div>
            <input
              type="checkbox"
              checked={settings.mirrorVideo}
              onChange={(e) => onUpdateSettings({ mirrorVideo: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-900">Render 33-Point Pose Skeleton</p>
              <p className="text-[11px] text-slate-500">Draws anatomical joints, links, and target vertex angle highlights</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showSkeletonOverlay}
              onChange={(e) => onUpdateSettings({ showSkeletonOverlay: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
          </label>
        </div>
      </div>

      {/* Audio & Accessibility Feedback */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Audio Cues & Accessibility</h2>
            <p className="text-xs text-slate-500">Low-latency acoustic feedback synthesized in-browser</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-900">Repetition Completion Chime</p>
              <p className="text-[11px] text-slate-500">Plays an ascending chime when a full repetition state cycle is validated</p>
            </div>
            <input
              type="checkbox"
              checked={settings.audioFeedbackEnabled}
              onChange={(e) => onUpdateSettings({ audioFeedbackEnabled: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-900">Postural Compensation Alerts</p>
              <p className="text-[11px] text-slate-500">Auditory warnings when trunk leaning or excessive velocity is detected</p>
            </div>
            <input
              type="checkbox"
              checked={settings.voiceGuidanceEnabled}
              onChange={(e) => onUpdateSettings({ voiceGuidanceEnabled: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
          </label>
        </div>
      </div>

      {/* Privacy and Security Guarantee */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          Client-Side Privacy Guarantee
        </div>
        <h3 className="text-lg font-bold">Your Video Never Leaves Your Device</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          RehabVision AI executes computer-vision inference entirely inside your local browser tab using WebAssembly and WebGL shaders. No video frames, audio recordings, or raw webcam streams are ever recorded, stored, or transmitted across the public Internet.
        </p>
      </div>

      {/* Demo Data Management */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 text-rose-700">Prototype Data Management</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Clear demo sessions and reset all patient profiles back to their baseline clinical prototype state.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo sessions and restore default sample patients?')) {
                onResetData();
              }
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Demo Storage</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch / Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
