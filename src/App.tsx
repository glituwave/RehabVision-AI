/**
 * RehabVision AI - Computer Vision Assisted Smart Rehabilitation Platform
 * Main Application Component
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { ExerciseLibrary } from './components/exercise/ExerciseLibrary';
import { LiveSession } from './components/session/LiveSession';
import { SessionResults } from './components/session/SessionResults';
import { ProgressReports } from './components/reports/ProgressReports';
import { TherapistDashboard } from './components/therapist/TherapistDashboard';
import { SettingsView } from './components/settings/SettingsView';
import { AuthModal } from './components/auth/AuthModal';

import { storage } from './services/storage';
import { UserProfile, ExerciseSession, PatientSummary, AppSettings } from './types';
import { EXERCISE_DEFINITIONS } from './services/exerciseLibrary';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile>(storage.getUserProfile());
  const [sessions, setSessions] = useState<ExerciseSession[]>(storage.getSessions());
  const [patients, setPatients] = useState<PatientSummary[]>(storage.getPatients());
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());

  // Session & Modal State
  const [activeExerciseId, setActiveExerciseId] = useState<string>(EXERCISE_DEFINITIONS[0].id);
  const [completedSession, setCompletedSession] = useState<ExerciseSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setCurrentUser(storage.getUserProfile());
      setSessions(storage.getSessions());
      setPatients(storage.getPatients());
      setSettings(storage.getSettings());
    });
    return () => unsubscribe();
  }, []);

  // Quick navigation handlers
  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartSession = (exerciseId?: string) => {
    if (exerciseId) {
      setActiveExerciseId(exerciseId);
    }
    setCurrentTab('session');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSessionComplete = (session: ExerciseSession) => {
    setCompletedSession(session);
    setCurrentTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSessionAndReturn = (notes?: string) => {
    if (completedSession) {
      const sessionToSave = {
        ...completedSession,
        notes: notes || completedSession.notes
      };
      storage.saveSession(sessionToSave);
    }
    setCompletedSession(null);
    setCurrentTab('dashboard');
  };

  const handleRepeatSession = () => {
    setCurrentTab('session');
  };

  const handleSwitchRole = (role: 'patient' | 'therapist') => {
    const updated = storage.switchRole(role);
    setCurrentUser(updated);
    if (role === 'therapist' && currentTab === 'dashboard') {
      setCurrentTab('therapist');
    } else if (role === 'patient' && currentTab === 'therapist') {
      setCurrentTab('dashboard');
    }
  };

  const handleLogin = (profile: UserProfile) => {
    storage.setUserProfile(profile);
    setCurrentUser(profile);
    if (profile.role === 'therapist') {
      setCurrentTab('therapist');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleUpdatePrescription = (patientId: string, assigned: PatientSummary['assignedExercises']) => {
    storage.updatePatientPrescription(patientId, assigned);
  };

  const handleSaveFeedbackToSession = (sessionId: string, feedback: string) => {
    const allSessions = storage.getSessions();
    const idx = allSessions.findIndex(s => s.id === sessionId);
    if (idx !== -1) {
      allSessions[idx].therapistFeedback = feedback;
      localStorage.setItem('rehabvision_sessions', JSON.stringify(allSessions));
      setSessions([...allSessions]);
    }
  };

  const handleResetData = () => {
    storage.resetAllData();
    setCurrentUser(storage.getUserProfile());
    setSessions(storage.getSessions());
    setPatients(storage.getPatients());
    setSettings(storage.getSettings());
    setCurrentTab('landing');
  };

  const currentPatientData = patients.find(p => p.id === currentUser.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onQuickStart={() => handleStartSession(activeExerciseId)}
      />

      {/* Main Container */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onStartRehabilitation={() => handleStartSession(activeExerciseId)}
            onExploreFeatures={() => handleNavigate('exercises')}
            onOpenTherapistPortal={() => {
              handleSwitchRole('therapist');
              handleNavigate('therapist');
            }}
            onSelectExercise={(id) => handleStartSession(id)}
          />
        )}

        {currentTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentUser.role === 'therapist' ? (
              <TherapistDashboard
                patients={patients}
                sessions={sessions}
                currentUser={currentUser}
                onUpdatePrescription={handleUpdatePrescription}
                onSaveFeedbackToSession={handleSaveFeedbackToSession}
              />
            ) : (
              <PatientDashboard
                currentUser={currentUser}
                sessions={sessions}
                patientData={currentPatientData}
                onStartSession={handleStartSession}
                onViewAllExercises={() => handleNavigate('exercises')}
                onViewReports={() => handleNavigate('reports')}
              />
            )}
          </div>
        )}

        {currentTab === 'exercises' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ExerciseLibrary
              onStartSession={handleStartSession}
              selectedExerciseId={activeExerciseId}
            />
          </div>
        )}

        {currentTab === 'session' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <LiveSession
              exerciseId={activeExerciseId}
              currentUser={currentUser}
              onCompleteSession={handleSessionComplete}
              onCancel={() => handleNavigate('exercises')}
            />
          </div>
        )}

        {currentTab === 'results' && completedSession && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SessionResults
              session={completedSession}
              onSaveAndReturn={handleSaveSessionAndReturn}
              onRepeatSession={handleRepeatSession}
              onViewReports={() => handleNavigate('reports')}
            />
          </div>
        )}

        {currentTab === 'reports' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProgressReports
              sessions={sessions}
              currentUser={currentUser}
            />
          </div>
        )}

        {currentTab === 'therapist' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TherapistDashboard
              patients={patients}
              sessions={sessions}
              currentUser={currentUser}
              onUpdatePrescription={handleUpdatePrescription}
              onSaveFeedbackToSession={handleSaveFeedbackToSession}
            />
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SettingsView
              settings={settings}
              onUpdateSettings={(newSettings) => storage.saveSettings(newSettings)}
              currentUser={currentUser}
              onUpdateProfile={(newProfile) => storage.setUserProfile(newProfile)}
              onResetData={handleResetData}
              onSwitchRole={handleSwitchRole}
              onLogout={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Global Auth / Persona Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        initialRole={currentUser.role}
      />
    </div>
  );
}
