/**
 * Storage Service: Client-side local persistence with reactive event emitter
 */

import { UserProfile, ExerciseSession, PatientSummary, AppSettings } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'rehabvision_user_profile',
  SESSIONS: 'rehabvision_sessions',
  PATIENTS: 'rehabvision_patients',
  SETTINGS: 'rehabvision_settings',
};

export const DEFAULT_PATIENT_USER: UserProfile = {
  id: 'patient-sarah-101',
  name: 'Sarah Jenkins',
  email: 'sarah.j@rehabvision.io',
  role: 'patient',
  condition: 'Right Knee ACL Reconstruction (Week 6 Post-Op)',
  therapistId: 'therapist-dr-chen',
  therapistName: 'Dr. Michael Chen, PT, DPT',
  injuredSide: 'right',
  surgeryDate: '2026-08-28',
  targetSessionsPerWeek: 5,
  streakDays: 4,
};

export const DEFAULT_THERAPIST_USER: UserProfile = {
  id: 'therapist-dr-chen',
  name: 'Dr. Michael Chen, PT, DPT',
  email: 'mchen@sportsmed-rehab.org',
  role: 'therapist',
  condition: 'Lead Clinical Physical Therapist',
  targetSessionsPerWeek: 0,
  streakDays: 0,
};

export const INITIAL_SETTINGS: AppSettings = {
  mirrorVideo: true,
  showSkeletonOverlay: true,
  audioFeedbackEnabled: true,
  voiceGuidanceEnabled: true,
  highContrastMode: false,
  jointConfidenceThreshold: 0.5,
  useSimulatorFallback: false,
};

export const INITIAL_PATIENTS: PatientSummary[] = [
  {
    id: 'patient-sarah-101',
    name: 'Sarah Jenkins',
    condition: 'Right Knee ACL Reconstruction',
    injurySide: 'Right',
    surgeryDate: '2026-08-28',
    adherenceRate: 88,
    totalSessions: 18,
    lastSessionDate: '2026-10-12',
    status: 'On Track',
    recentRom: 125,
    targetRom: 135,
    avatarColor: 'bg-teal-500',
    assignedExercises: [
      { exerciseId: 'knee-extensions', exerciseName: 'Seated Knee Extensions', targetReps: 12, targetSets: 3, frequencyPerWeek: 5 },
      { exerciseId: 'seated-leg-raises', exerciseName: 'Seated Straight Leg Raises', targetReps: 10, targetSets: 3, frequencyPerWeek: 4 },
      { exerciseId: 'squats', exerciseName: 'Supported Functional Squats', targetReps: 8, targetSets: 2, frequencyPerWeek: 3 }
    ]
  },
  {
    id: 'patient-marcus-102',
    name: 'Marcus Vance',
    condition: 'Left Rotator Cuff Supraspinatus Repair',
    injurySide: 'Left',
    surgeryDate: '2026-09-04',
    adherenceRate: 94,
    totalSessions: 22,
    lastSessionDate: '2026-10-13',
    status: 'Milestone Reached',
    recentRom: 92,
    targetRom: 95,
    avatarColor: 'bg-sky-500',
    assignedExercises: [
      { exerciseId: 'shoulder-raises', exerciseName: 'Anterior Shoulder Raises', targetReps: 10, targetSets: 3, frequencyPerWeek: 5 },
      { exerciseId: 'shoulder-abduction', exerciseName: 'Standing Shoulder Abduction', targetReps: 10, targetSets: 3, frequencyPerWeek: 4 },
      { exerciseId: 'arm-curls', exerciseName: 'Biceps Arm Curls', targetReps: 12, targetSets: 2, frequencyPerWeek: 3 }
    ]
  },
  {
    id: 'patient-elena-103',
    name: 'Elena Rostova',
    condition: 'Total Knee Arthroplasty (TKA)',
    injurySide: 'Left',
    surgeryDate: '2026-09-18',
    adherenceRate: 64,
    totalSessions: 9,
    lastSessionDate: '2026-10-09',
    status: 'Needs Review',
    recentRom: 98,
    targetRom: 120,
    avatarColor: 'bg-amber-500',
    assignedExercises: [
      { exerciseId: 'knee-extensions', exerciseName: 'Seated Knee Extensions', targetReps: 10, targetSets: 3, frequencyPerWeek: 5 },
      { exerciseId: 'seated-leg-raises', exerciseName: 'Seated Straight Leg Raises', targetReps: 8, targetSets: 2, frequencyPerWeek: 4 }
    ]
  },
  {
    id: 'patient-david-104',
    name: 'David Kim',
    condition: 'Lumbar Spine Post-Discectomy & Core Stability',
    injurySide: 'Bilateral',
    surgeryDate: '2026-08-12',
    adherenceRate: 78,
    totalSessions: 15,
    lastSessionDate: '2026-10-11',
    status: 'On Track',
    recentRom: 75,
    targetRom: 85,
    avatarColor: 'bg-indigo-500',
    assignedExercises: [
      { exerciseId: 'squats', exerciseName: 'Supported Functional Squats', targetReps: 10, targetSets: 3, frequencyPerWeek: 4 },
      { exerciseId: 'seated-leg-raises', exerciseName: 'Seated Straight Leg Raises', targetReps: 12, targetSets: 3, frequencyPerWeek: 4 }
    ]
  }
];

export const INITIAL_SESSIONS: ExerciseSession[] = [
  {
    id: 'sess-20261012-01',
    patientId: 'patient-sarah-101',
    patientName: 'Sarah Jenkins',
    exerciseId: 'knee-extensions',
    exerciseName: 'Seated Knee Extensions',
    startTime: '2026-10-12T14:20:00Z',
    endTime: '2026-10-12T14:28:30Z',
    durationSeconds: 510,
    repsCompleted: 12,
    targetReps: 12,
    setsCompleted: 1,
    targetSets: 1,
    averageFormScore: 94,
    maxRangeOfMotion: 168,
    targetRangeOfMotion: 170,
    status: 'completed',
    feedbackLogs: [
      { id: 'fb-1', timestamp: 12000, message: 'Good baseline posture confirmed', type: 'info' },
      { id: 'fb-2', timestamp: 45000, message: 'Smooth terminal extension achieved (168°)', type: 'success' },
      { id: 'fb-3', timestamp: 180000, message: 'Slight compensatory trunk lean detected on rep 7', type: 'warning' },
      { id: 'fb-4', timestamp: 320000, message: 'Excellent tempo and steady eccentric lowering', type: 'success' }
    ],
    repetitionRecords: [
      { repNumber: 1, durationSeconds: 4.1, peakAngle: 165, formScore: 92, feedbackNote: 'Clean trajectory' },
      { repNumber: 2, durationSeconds: 3.9, peakAngle: 167, formScore: 95, feedbackNote: 'Great hold' },
      { repNumber: 3, durationSeconds: 4.2, peakAngle: 168, formScore: 96, feedbackNote: 'Optimal extension' },
      { repNumber: 4, durationSeconds: 3.8, peakAngle: 166, formScore: 94, feedbackNote: 'Controlled descent' },
      { repNumber: 5, durationSeconds: 4.0, peakAngle: 169, formScore: 97, feedbackNote: 'Superb control' },
      { repNumber: 6, durationSeconds: 4.3, peakAngle: 165, formScore: 93, feedbackNote: 'Steady rhythm' },
      { repNumber: 7, durationSeconds: 3.5, peakAngle: 162, formScore: 88, feedbackNote: 'Trunk compensation noted' },
      { repNumber: 8, durationSeconds: 4.0, peakAngle: 167, formScore: 95, feedbackNote: 'Corrected posture' },
      { repNumber: 9, durationSeconds: 4.1, peakAngle: 168, formScore: 96, feedbackNote: 'Solid quadriceps squeeze' },
      { repNumber: 10, durationSeconds: 4.4, peakAngle: 166, formScore: 94, feedbackNote: 'Consistent ROM' },
      { repNumber: 11, durationSeconds: 4.2, peakAngle: 165, formScore: 93, feedbackNote: 'High stability' },
      { repNumber: 12, durationSeconds: 4.5, peakAngle: 168, formScore: 96, feedbackNote: 'Finished set strong' }
    ],
    notes: 'Completed prescribed evening set. Right knee stiffness reduced compared to yesterday.',
    therapistFeedback: 'Great progress Sarah. Your quadriceps lag is visibly decreasing. Continue prioritizing that 2-second hold at top.'
  },
  {
    id: 'sess-20261011-01',
    patientId: 'patient-sarah-101',
    patientName: 'Sarah Jenkins',
    exerciseId: 'seated-leg-raises',
    exerciseName: 'Seated Straight Leg Raises',
    startTime: '2026-10-11T10:15:00Z',
    endTime: '2026-10-11T10:22:00Z',
    durationSeconds: 420,
    repsCompleted: 10,
    targetReps: 10,
    setsCompleted: 1,
    targetSets: 1,
    averageFormScore: 91,
    maxRangeOfMotion: 114,
    targetRangeOfMotion: 115,
    status: 'completed',
    feedbackLogs: [
      { id: 'fb-5', timestamp: 15000, message: 'Position calibrated in chair', type: 'info' },
      { id: 'fb-6', timestamp: 120000, message: 'Steady elevation angle', type: 'success' }
    ],
    repetitionRecords: [
      { repNumber: 1, durationSeconds: 3.8, peakAngle: 112, formScore: 90 },
      { repNumber: 2, durationSeconds: 4.0, peakAngle: 114, formScore: 92 },
      { repNumber: 3, durationSeconds: 4.1, peakAngle: 115, formScore: 94 },
      { repNumber: 4, durationSeconds: 3.9, peakAngle: 113, formScore: 91 },
      { repNumber: 5, durationSeconds: 3.7, peakAngle: 111, formScore: 89 },
      { repNumber: 6, durationSeconds: 4.2, peakAngle: 114, formScore: 93 },
      { repNumber: 7, durationSeconds: 4.0, peakAngle: 115, formScore: 94 },
      { repNumber: 8, durationSeconds: 4.3, peakAngle: 114, formScore: 92 },
      { repNumber: 9, durationSeconds: 3.9, peakAngle: 112, formScore: 90 },
      { repNumber: 10, durationSeconds: 4.1, peakAngle: 113, formScore: 91 }
    ],
    notes: 'Mild fatigue in hip flexor towards rep 8, completed with upright back.',
    therapistFeedback: 'Good spinal discipline without backward pelvic roll.'
  },
  {
    id: 'sess-20261010-01',
    patientId: 'patient-sarah-101',
    patientName: 'Sarah Jenkins',
    exerciseId: 'squats',
    exerciseName: 'Supported Functional Squats',
    startTime: '2026-10-10T16:00:00Z',
    endTime: '2026-10-10T16:06:40Z',
    durationSeconds: 400,
    repsCompleted: 8,
    targetReps: 8,
    setsCompleted: 1,
    targetSets: 1,
    averageFormScore: 87,
    maxRangeOfMotion: 96,
    targetRangeOfMotion: 95,
    status: 'completed',
    feedbackLogs: [
      { id: 'fb-7', timestamp: 30000, message: 'Knee valgus checked: good knee-over-toe alignment', type: 'success' },
      { id: 'fb-8', timestamp: 140000, message: 'Slight weight shift toward left uninjured side', type: 'warning' }
    ],
    repetitionRecords: [
      { repNumber: 1, durationSeconds: 4.5, peakAngle: 98, formScore: 89 },
      { repNumber: 2, durationSeconds: 4.6, peakAngle: 96, formScore: 88 },
      { repNumber: 3, durationSeconds: 4.4, peakAngle: 95, formScore: 87 },
      { repNumber: 4, durationSeconds: 4.8, peakAngle: 97, formScore: 88 },
      { repNumber: 5, durationSeconds: 4.5, peakAngle: 96, formScore: 87 },
      { repNumber: 6, durationSeconds: 4.2, peakAngle: 94, formScore: 86 },
      { repNumber: 7, durationSeconds: 4.6, peakAngle: 95, formScore: 86 },
      { repNumber: 8, durationSeconds: 4.7, peakAngle: 96, formScore: 87 }
    ],
    notes: 'Used kitchen counter for gentle finger touch support as advised.',
    therapistFeedback: 'Notice slight favor toward your left side. Focus on 50/50 ground reaction force next round.'
  },
  {
    id: 'sess-20261008-01',
    patientId: 'patient-sarah-101',
    patientName: 'Sarah Jenkins',
    exerciseId: 'knee-extensions',
    exerciseName: 'Seated Knee Extensions',
    startTime: '2026-10-08T15:10:00Z',
    endTime: '2026-10-08T15:17:30Z',
    durationSeconds: 450,
    repsCompleted: 12,
    targetReps: 12,
    setsCompleted: 1,
    targetSets: 1,
    averageFormScore: 90,
    maxRangeOfMotion: 164,
    targetRangeOfMotion: 170,
    status: 'completed',
    feedbackLogs: [
      { id: 'fb-9', timestamp: 10000, message: 'Baseline setup ok', type: 'info' }
    ],
    repetitionRecords: [
      { repNumber: 1, durationSeconds: 4.0, peakAngle: 162, formScore: 88 },
      { repNumber: 2, durationSeconds: 4.1, peakAngle: 163, formScore: 89 },
      { repNumber: 3, durationSeconds: 4.0, peakAngle: 164, formScore: 90 },
      { repNumber: 4, durationSeconds: 3.9, peakAngle: 165, formScore: 91 },
      { repNumber: 5, durationSeconds: 4.2, peakAngle: 164, formScore: 90 },
      { repNumber: 6, durationSeconds: 4.0, peakAngle: 163, formScore: 89 },
      { repNumber: 7, durationSeconds: 4.1, peakAngle: 164, formScore: 90 },
      { repNumber: 8, durationSeconds: 3.8, peakAngle: 163, formScore: 89 },
      { repNumber: 9, durationSeconds: 4.0, peakAngle: 164, formScore: 91 },
      { repNumber: 10, durationSeconds: 4.1, peakAngle: 165, formScore: 92 },
      { repNumber: 11, durationSeconds: 4.2, peakAngle: 164, formScore: 91 },
      { repNumber: 12, durationSeconds: 4.4, peakAngle: 165, formScore: 92 }
    ],
    notes: 'Good warm session.',
    therapistFeedback: 'Nice work reaching 164° today.'
  }
];

class StorageService {
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Error notifying storage listener:', err);
      }
    });
  }

  getUserProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading user profile from localStorage:', e);
    }
    return DEFAULT_PATIENT_USER;
  }

  setUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      this.notify();
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  }

  switchRole(role: 'patient' | 'therapist'): UserProfile {
    const newProfile = role === 'patient' ? { ...DEFAULT_PATIENT_USER } : { ...DEFAULT_THERAPIST_USER };
    this.setUserProfile(newProfile);
    return newProfile;
  }

  getSessions(): ExerciseSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading sessions from localStorage:', e);
    }
    // Return initial sample sessions
    return INITIAL_SESSIONS;
  }

  saveSession(session: ExerciseSession): void {
    try {
      const current = this.getSessions();
      // Prepend the new session
      const updated = [session, ...current];
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));

      // Update patient stats if this matches current patient
      const patients = this.getPatients();
      const patientIdx = patients.findIndex(p => p.id === session.patientId);
      if (patientIdx !== -1) {
        const patient = patients[patientIdx];
        patient.totalSessions += 1;
        patient.lastSessionDate = new Date().toISOString().split('T')[0];
        patient.recentRom = session.maxRangeOfMotion;
        // Slight bump in adherence
        patient.adherenceRate = Math.min(100, Math.round(patient.adherenceRate * 0.95 + 100 * 0.05));
        patients[patientIdx] = patient;
        this.savePatients(patients);
      }

      this.notify();
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  }

  getPatients(): PatientSummary[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading patients:', e);
    }
    return INITIAL_PATIENTS;
  }

  savePatients(patients: PatientSummary[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      this.notify();
    } catch (e) {
      console.error('Failed to save patients:', e);
    }
  }

  updatePatientPrescription(patientId: string, assignedExercises: PatientSummary['assignedExercises']): void {
    const patients = this.getPatients();
    const idx = patients.findIndex(p => p.id === patientId);
    if (idx !== -1) {
      patients[idx].assignedExercises = assignedExercises;
      this.savePatients(patients);
    }
  }

  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return { ...INITIAL_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.warn('Error reading settings:', e);
    }
    return INITIAL_SETTINGS;
  }

  saveSettings(settings: Partial<AppSettings>): void {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      this.notify();
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  resetAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.PATIENTS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      this.notify();
    } catch (e) {
      console.error('Failed to reset storage:', e);
    }
  }
}

export const storage = new StorageService();
