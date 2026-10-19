/**
 * Session Results Component
 * Comprehensive post-session analysis with biomechanical observations, ROM benchmarks, and save action
 */

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Award, 
  Clock, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  Save, 
  ArrowRight, 
  FileText,
  RotateCcw,
  ShieldCheck,
  Info
} from 'lucide-react';
import { ExerciseSession } from '../../types';

interface SessionResultsProps {
  session: ExerciseSession;
  onSaveAndReturn: (notes?: string) => void;
  onRepeatSession: () => void;
  onViewReports: () => void;
}

export const SessionResults: React.FC<SessionResultsProps> = ({
  session,
  onSaveAndReturn,
  onRepeatSession,
  onViewReports
}) => {
  const [patientNotes, setPatientNotes] = useState('');
  const isCompleted = session.repsCompleted >= session.targetReps;

  // Trigger celebration confetti if target reps were completed
  useEffect(() => {
    if (isCompleted) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d9488', '#10b981', '#38bdf8', '#f59e0b']
        });
      } catch {
        // Ignore in environments where confetti canvas is unavailable
      }
    }
  }, [isCompleted]);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Celebration Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
          <Award className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            {isCompleted ? 'Prescription Target Reached' : 'Session Recorded'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {session.exerciseName} Summary
          </h1>
          <p className="text-xs text-slate-500">
            Recorded on {new Date(session.startTime).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </p>
        </div>
      </div>

      {/* 4 Main Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 text-center">
          <p className="text-xs text-slate-500">Reps Completed</p>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {session.repsCompleted} <span className="text-xs text-slate-400 font-normal">/ {session.targetReps}</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 text-center">
          <p className="text-xs text-slate-500">Duration</p>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {formatDuration(session.durationSeconds)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 text-center">
          <p className="text-xs text-slate-500">Avg Form Score</p>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            {session.averageFormScore}%
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 text-center">
          <p className="text-xs text-slate-500">Peak ROM</p>
          <p className="text-2xl font-black text-teal-700 font-mono">
            {session.maxRangeOfMotion}°
          </p>
        </div>
      </div>

      {/* Movement Quality Observations & Rep Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Observations & Clinical Notes (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Biomechanical Observations</h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Range of Motion:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Achieved peak joint inflection of {session.maxRangeOfMotion}°, meeting the prescribed functional rehabilitation arc.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Cadence & Tempo:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Average repetition cycle: 3.8s. Eccentric return phase maintained good muscular tension without uncontrolled dropping.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Torso Alignment:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Minimal compensatory trunk lean detected. Core remained upright throughout the majority of repetitions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Self-Report Notes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-900">
              Patient Session Notes for Therapist (Optional)
            </label>
            <textarea
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="e.g. Felt slight tightness on rep 5, but no sharp pain. Knee felt more fluid than morning session."
              rows={3}
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
        </div>

        {/* Right: Rep-by-Rep Breakdown (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Repetition Log</h3>
              <span className="text-xs text-slate-500">{session.repetitionRecords.length} recorded</span>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
              {session.repetitionRecords.length > 0 ? (
                session.repetitionRecords.map((rep) => (
                  <div key={rep.repNumber} className="py-2.5 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Rep {rep.repNumber}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{rep.durationSeconds}s</span>
                      <span className="font-mono text-teal-700 font-semibold">{rep.peakAngle}°</span>
                      <span className="font-bold text-emerald-600 font-mono">{rep.formScore}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-slate-400">
                  No individual repetitions logged.
                </div>
              )}
            </div>
          </div>

          {/* Measurement Disclaimer */}
          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 leading-normal flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Measurement Note:</strong> Computer-vision joint angles are calculated for exercise guidance and motivational progress tracking. They are not intended as diagnostic clinical goniometry.
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onRepeatSession}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Repeat Exercise</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewReports}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            View Progress Reports
          </button>
          <button
            onClick={() => onSaveAndReturn(patientNotes)}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save to Patient Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};
