/**
 * RehabVision AI - Domain Types and Interfaces
 */

export type UserRole = 'patient' | 'therapist';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  condition?: string; // e.g. "Right Knee ACL Reconstruction"
  therapistId?: string;
  therapistName?: string;
  injuredSide?: 'left' | 'right' | 'bilateral' | 'none';
  surgeryDate?: string;
  targetSessionsPerWeek?: number;
  streakDays?: number;
}

export type BodyRegion = 'shoulders' | 'arms' | 'knees' | 'legs' | 'posture';
export type ExerciseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: BodyRegion;
  difficulty: ExerciseDifficulty;
  targetRegion: string;
  targetMuscles: string[];
  description: string;
  instructions: string[];
  clinicalCautions: string[];
  defaultReps: number;
  defaultSets: number;
  targetAngleMin: number; // e.g. 45 degrees
  targetAngleMax: number; // e.g. 150 degrees
  primaryJoint: string; // e.g. 'Right Knee', 'Right Elbow', 'Left Shoulder'
  secondaryJoint?: string;
  repPhaseStartAngle: number;
  repPhasePeakAngle: number;
  videoPlaceholderUrl?: string;
  iconName: string;
}

export interface JointAngleResult {
  jointName: string;
  angle: number; // In degrees
  confidence: number;
  status: 'optimal' | 'warning' | 'alert';
}

export interface NormalizedLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface FormFeedbackEvent {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'correction';
}

export interface RepetitionRecord {
  repNumber: number;
  durationSeconds: number;
  peakAngle: number;
  formScore: number; // 0 - 100
  feedbackNote?: string;
}

export interface ExerciseSession {
  id: string;
  patientId: string;
  patientName: string;
  exerciseId: string;
  exerciseName: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  repsCompleted: number;
  targetReps: number;
  setsCompleted: number;
  targetSets: number;
  averageFormScore: number;
  maxRangeOfMotion: number; // degrees
  targetRangeOfMotion: number; // degrees
  status: 'completed' | 'abandoned' | 'partial';
  feedbackLogs: FormFeedbackEvent[];
  repetitionRecords: RepetitionRecord[];
  notes?: string;
  therapistFeedback?: string;
}

export interface PatientSummary {
  id: string;
  name: string;
  condition: string;
  injurySide: 'Left' | 'Right' | 'Bilateral' | 'General';
  surgeryDate: string;
  adherenceRate: number; // percentage (0-100)
  totalSessions: number;
  lastSessionDate: string;
  status: 'On Track' | 'Needs Review' | 'Milestone Reached' | 'At Risk';
  assignedExercises: {
    exerciseId: string;
    exerciseName: string;
    targetReps: number;
    targetSets: number;
    frequencyPerWeek: number;
  }[];
  recentRom: number;
  targetRom: number;
  avatarColor: string;
}

export interface AppSettings {
  cameraDeviceId?: string;
  mirrorVideo: boolean;
  showSkeletonOverlay: boolean;
  audioFeedbackEnabled: boolean;
  voiceGuidanceEnabled: boolean;
  highContrastMode: boolean;
  jointConfidenceThreshold: number; // 0.0 - 1.0
  useSimulatorFallback: boolean;
}
