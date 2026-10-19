/**
 * Patient Dashboard: Core recovery hub with adherence metrics, prescriptions, and session launcher
 */

import React from 'react';
import { 
  Play, 
  Activity, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle,
  FileText,
  Video,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { UserProfile, ExerciseSession, PatientSummary } from '../../types';
import { EXERCISE_DEFINITIONS } from '../../services/exerciseLibrary';

interface PatientDashboardProps {
  currentUser: UserProfile;
  sessions: ExerciseSession[];
  patientData?: PatientSummary;
  onStartSession: (exerciseId?: string) => void;
  onViewAllExercises: () => void;
  onViewReports: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  currentUser,
  sessions,
  patientData,
  onStartSession,
  onViewAllExercises,
  onViewReports
}) => {
  // Aggregate stats
  const totalSessionsCount = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalRepsCompleted = sessions.reduce((acc, s) => acc + s.repsCompleted, 0);
  const averageForm = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.averageFormScore, 0) / sessions.length)
    : 92;
  const adherenceRate = patientData?.adherenceRate ?? 88;

  // Chart data: daily sessions / ROM trend
  const chartData = [
    { day: 'Mon', rom: 148, reps: 24, targetRom: 160 },
    { day: 'Tue', rom: 152, reps: 20, targetRom: 160 },
    { day: 'Wed', rom: 155, reps: 30, targetRom: 160 },
    { day: 'Thu', rom: 158, reps: 22, targetRom: 160 },
    { day: 'Fri', rom: 162, reps: 32, targetRom: 160 },
    { day: 'Sat', rom: 165, reps: 24, targetRom: 160 },
    { day: 'Sun', rom: 168, reps: 26, targetRom: 160 }
  ];

  const recentSessions = sessions.slice(0, 4);

  // Recommended next exercise
  const nextPrescribedExercise = EXERCISE_DEFINITIONS.find(ex => ex.id === 'knee-extensions') || EXERCISE_DEFINITIONS[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-200">
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              <span>Rehabilitation Care Plan</span>
              <span aria-hidden="true" className="text-teal-400">·</span>
              <span>{currentUser.condition || 'Week 6 Post-Operative Protocol'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-teal-100 text-sm max-w-xl">
              You are on day {currentUser.streakDays ?? 4} of your rehabilitation streak. Dr. Michael Chen noted: <em>"Great terminal knee extension yesterday. Keep up the quadriceps holds."</em>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartSession(nextPrescribedExercise.id)}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-teal-900 font-bold text-sm rounded-xl shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-teal-900" />
              <span>Start Prescribed Session</span>
            </button>
            <button
              onClick={onViewReports}
              className="px-4 py-3 bg-teal-900/60 hover:bg-teal-900/80 text-white font-medium text-sm rounded-xl border border-teal-500/30 transition-colors"
            >
              View Full Clinical Chart
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Weekly Adherence</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{adherenceRate}%</span>
              <span className="text-xs font-semibold text-emerald-600">+4% this week</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full" 
                style={{ width: `${adherenceRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Sessions</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{totalSessionsCount}</span>
              <span className="text-xs text-slate-500">({completedSessions.length} verified)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Goal: 5 sessions / week</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Repetitions</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{totalRepsCompleted}</span>
              <span className="text-xs text-slate-500">reps logged</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Avg Form Score: {averageForm}/100</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Streak</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{currentUser.streakDays ?? 4} Days</span>
              <span className="text-xs font-semibold text-amber-600">Active</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Keep it going tomorrow</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: ROM Trend and Recent Activity (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* ROM Progress Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Range of Motion (ROM) Progression</h3>
                <p className="text-xs text-slate-500">Peak active extension degrees measured by computer vision</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  Measured ROM (°)
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  Clinical Target (160°)
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="romGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[120, 180]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: unknown) => [`${val ?? 0}°`, 'Extension Angle']}
                  />
                  <Area type="monotone" dataKey="rom" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#romGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Rehabilitation Sessions</h3>
                <p className="text-xs text-slate-500">Recorded telemetry and posture observations</p>
              </div>
              <button
                onClick={onViewReports}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>View Full Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentSessions.map((session) => (
                <div key={session.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{session.exerciseName}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{new Date(session.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <span aria-hidden="true">·</span>
                        <span>{Math.round(session.durationSeconds / 60)} mins</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-emerald-600">{session.repsCompleted} reps</span>
                      </div>
                      {session.therapistFeedback && (
                        <p className="text-xs text-teal-900 bg-teal-50/70 p-2 rounded-lg mt-2 border border-teal-100">
                          <strong>PT Feedback:</strong> {session.therapistFeedback}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      Form Score: {session.averageFormScore}%
                    </span>
                    <span className="text-[11px] text-teal-700 font-medium">
                      Peak ROM: {session.maxRangeOfMotion}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Prescribed Exercises & Upcoming Consult (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Start Prescriptions Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Today's Prescriptions</h3>
              <button
                onClick={onViewAllExercises}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                Catalog
              </button>
            </div>

            <div className="space-y-3">
              {EXERCISE_DEFINITIONS.slice(0, 3).map((exercise) => (
                <div 
                  key={exercise.id}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-teal-400 bg-slate-50/60 hover:bg-teal-50/20 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                      {exercise.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {exercise.defaultSets} sets × {exercise.defaultReps} reps · {exercise.targetRegion.split('/')[0]}
                    </p>
                  </div>

                  <button
                    onClick={() => onStartSession(exercise.id)}
                    className="p-2 bg-white group-hover:bg-teal-600 text-teal-700 group-hover:text-white rounded-lg border border-slate-200 group-hover:border-teal-600 shadow-xs transition-colors shrink-0"
                    title={`Start ${exercise.name}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={onViewAllExercises}
              className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Browse All Exercises (6 available)
            </button>
          </div>

          {/* Upcoming Tele-Rehab Session */}
          <div className="bg-gradient-to-br from-sky-50 to-white p-6 rounded-2xl border border-sky-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Upcoming PT Tele-Review</h4>
                <p className="text-xs text-slate-500">With {currentUser.therapistName || 'Dr. Michael Chen'}</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-sky-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-600">
                <span>Date:</span>
                <span className="font-semibold text-slate-900">Thursday, Oct 16, 2026</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Time:</span>
                <span className="font-semibold text-slate-900">2:30 PM (30 min)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Topic:</span>
                <span className="font-semibold text-teal-700">Week 7 Progression Review</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your clinician will review the ROM goniometry curves and repetition cadence logged during your home sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
